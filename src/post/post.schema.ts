import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Likes } from '../like-comment/like-comment.schema';
import { Comments } from '../like-comment/like-comment.schema';

@Schema()
export class Post extends Document {
    @Prop({ required: true })
    uid: string;

    @Prop({ required: true })
    userId: string;

    @Prop()
    content: string;

    @Prop([String])
    media: string[];

    @Prop({ default: new Date() })
    timestamp: Date;

    @Prop({ default: 0 })
    likesCount: number;

    @Prop({ default: 0 })
    commentsCount: number;

    @Prop([{ type: Types.ObjectId, ref: Likes.name }])
    likes: Types.Array<Types.ObjectId>;

    @Prop([{ type: Types.ObjectId, ref: Comments.name }])
    comments: Types.Array<Types.ObjectId>;
}

export const PostSchema = SchemaFactory.createForClass(Post);