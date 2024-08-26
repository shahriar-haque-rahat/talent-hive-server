import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { Post as PostModel } from './post.schema';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    // Get all posts
    @Get()
    async findAll(): Promise<PostModel[]> {
        return this.postService.findAllPost();
    }

    // Get a post by UID
    @Get(':uid')
    async findOne(@Param('uid') uid: string): Promise<PostModel> {
        return this.postService.findOnePost(uid);
    }

    // Create a new post
    @Post()
    async create(@Body() createPostDto: CreatePostDto): Promise<PostModel> {
        return this.postService.createPost(createPostDto);
    }

    // Update a post by UID
    @Put(':uid')
    async update(@Param('uid') uid: string, @Body() updatePostDto: UpdatePostDto): Promise<PostModel> {
        return this.postService.updatePost(uid, updatePostDto);
    }

    // Delete a post by UID
    @Delete(':uid')
    async delete(@Param('uid') uid: string): Promise<PostModel> {
        return this.postService.deletePost(uid);
    }
}
