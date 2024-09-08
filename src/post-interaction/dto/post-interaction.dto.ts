import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, Allow, IsOptional, IsDate } from 'class-validator';

// Like
export class CreateLikeDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    postId: string;

    @IsOptional()
    @IsDate()
    createdOn?: Date;
}

// Comment
export class CreateCommentDto {
    @Allow()
    _id?: string;

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    postId: string;

    @IsString()
    @IsNotEmpty()
    comment: string;

    @IsOptional()
    @IsDate()
    createdOn?: Date;

    @IsOptional()
    @IsDate()
    modifiedOn?: Date;
}
export class UpdateCommentDto extends PartialType(CreateCommentDto) { }

// Save
export class CreateSaveDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    postId: string;

    @IsOptional()
    @IsDate()
    createdOn?: Date;
}
