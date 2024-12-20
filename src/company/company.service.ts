import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './company.schema';
import { Model } from 'mongoose';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { CompanyFollower } from 'src/company-followers/company-followers.schema';
import { JobPost } from 'src/job-post/job-post.schema';

@Injectable()
export class CompanyService {
    constructor(
        @InjectModel(Company.name) private companyModel: Model<Company>,
        @InjectModel(CompanyFollower.name) private followerModel: Model<CompanyFollower>,
        @InjectModel(JobPost.name) private jobPostModel: Model<JobPost>,
    ) { }

    async companyMetaData(id: string): Promise<Company> {
        const company = await this.companyModel
            .findById(id)
            .select('companyName')
            .exec();

        if (!company) {
            throw new Error("Company not found");
        }

        return company;
    }

    async searchByName(name: string) {
        try {
            const companies = await this.companyModel
                .find({ companyName: { $regex: name, $options: 'i' } })
                .select('companyName companyProfileImage')
                .exec();

            return companies;
        } catch (error) {
            throw new InternalServerErrorException(
                error.message || 'Unable to get companies'
            );
        }
    }

    async findAllCompanies(page: number, limit: number): Promise<{ companies: Company[], page: number }> {
        const skip = page * limit;

        const companies = await this.companyModel
            .find()
            .populate('employerId', '-__v')
            .sort({ updatedAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        if (!companies) {
            throw new Error("Companies not found");
        }

        return {
            companies,
            page: +page + 1
        };
    }

    async getFollowedCompanies(userId: string, page: number, limit: number): Promise<{ companies: Company[], page: number }> {
        const skip = page * limit;

        const followerDocs = await this.followerModel.find({ followerIds: userId }).exec();
        const followedCompanyIds = followerDocs.map(doc => doc.companyId);

        const companies = await this.companyModel
            .find({ _id: { $in: followedCompanyIds } })
            .populate('employerId', '-__v')
            .skip(skip)
            .limit(limit)
            .exec();

        return {
            companies,
            page: +page + 1
        };
    }

    async getNotFollowedCompanies(userId: string, page: number, limit: number): Promise<{ companies: Company[], page: number }> {
        const skip = page * limit;

        const followerDocs = await this.followerModel.find({ followerIds: userId }).exec();
        const followedCompanyIds = followerDocs.map(doc => doc.companyId);

        const companies = await this.companyModel
            .find({ _id: { $nin: followedCompanyIds } })
            .populate('employerId', '-__v')
            .skip(skip)
            .limit(limit)
            .exec();

        return {
            companies,
            page: +page + 1
        };
    }

    async findCompanyById(id: string, userId: string): Promise<{ company: Company, isFollowed: boolean }> {
        const company = await this.companyModel
            .findById(id)
            .populate('employerId', '-__v')
            .sort({ updatedAt: -1, _id: -1 })
            .lean()
            .exec();

        if (!company) {
            throw new Error("Company not found");
        }

        const isFollowed = await this.followerModel.exists({
            companyId: id,
            followerIds: userId,
        });

        return {
            company,
            isFollowed: Boolean(isFollowed),
        };
    }

    async findCompaniesByEmployer(employerId: string): Promise<Company[]> {
        const companies = await this.companyModel
            .find({ employerId })
            .populate('employerId', '-__v')
            .sort({ updatedAt: -1, _id: -1 })
            .exec();

        if (!companies) {
            throw new Error("Companies not found");
        }

        return companies;
    }

    async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
        const newCompany = new this.companyModel(createCompanyDto);
        return newCompany.save();
    }

    async updateCompany(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
        const updatedCompany = await this.companyModel.findByIdAndUpdate(
            id,
            { $set: updateCompanyDto },
            { new: true, runValidators: true }
        ).exec();

        if (!updatedCompany) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }

        return updatedCompany;
    }

    async deleteCompany(id: string): Promise<Company> {
        const deletedCompany = await this.companyModel.findByIdAndDelete(id).exec();

        if (!deletedCompany) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }

        await this.jobPostModel.deleteMany({ companyId: id }).exec();

        return deletedCompany;
    }
}
