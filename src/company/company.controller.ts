import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.schema';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @Get('metadata/:id')
    async companyMetaData(
        @Param('id') id: string,
    ): Promise<Company> {
        return this.companyService.companyMetaData(id);
    }

    @Get('search-by-name')
    async searchByName(
        @Query('name') name: string
    ) {
        return this.companyService.searchByName(name);
    }

    @Get()
    async findAllCompanies(
        @Query('page') page: number,
        @Query('limit') limit: number
    ): Promise<{ companies: Company[], page: number }> {
        return this.companyService.findAllCompanies(page, limit);
    }

    @Get('followed/:userId')
    async getFollowedCompanies(
        @Param('userId') userId: string,
        @Query('page') page: number,
        @Query('limit') limit: number
    ): Promise<{ companies: Company[], page: number }> {
        return this.companyService.getFollowedCompanies(userId, page, limit);
    }

    @Get('not-followed/:userId')
    async getNotFollowedCompanies(
        @Param('userId') userId: string,
        @Query('page') page: number,
        @Query('limit') limit: number
    ): Promise<{ companies: Company[], page: number }> {
        return this.companyService.getNotFollowedCompanies(userId, page, limit);
    }

    @Get('company-details/:id/:userId')
    async findCompanyById(
        @Param('id') id: string,
        @Param('userId') userId: string
    ): Promise<{ company: Company, isFollowed: boolean }> {
        return this.companyService.findCompanyById(id, userId);
    }

    @Get(':employerId')
    async findCompaniesByEmployer(
        @Param('employerId') employerId: string
    ): Promise<Company[]> {
        return this.companyService.findCompaniesByEmployer(employerId);
    }

    @Post()
    async createCompany(@Body() createCompanyDtoCreateCompanyDto: CreateCompanyDto): Promise<Company> {
        return this.companyService.createCompany(createCompanyDtoCreateCompanyDto);
    }

    @Patch(':id')
    async updateCompany(@Param('id') id: string, @Body() updateCompanyDtoUpdateCompanyDto: UpdateCompanyDto): Promise<Company> {
        return this.companyService.updateCompany(id, updateCompanyDtoUpdateCompanyDto);
    }

    @Delete(':id')
    async deleteCompany(@Param('id') id: string): Promise<Company> {
        return this.companyService.deleteCompany(id);
    }
}
