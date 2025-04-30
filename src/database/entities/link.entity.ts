import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Link extends Document{
  
    @Prop({
      unique: true,
      index: true
    })
    originalUrl: string;
    @Prop({
      index: true
    })
    enmaskUrl: string;

    @Prop({
      index: true,
      unique: true
    })
    enmask: string

    @Prop()
    password?: string;

    @Prop()
    expires?: Date;

    @Prop({
      default: true
    })
    isValid: boolean;

    @Prop({
      isInteger: true,
      default: 0
    })
    redirectCount: number;

  }

    export const LinkSchema = SchemaFactory.createForClass( Link );
