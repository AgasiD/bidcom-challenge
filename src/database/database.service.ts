import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { handleException } from '../common/helpers/helpers';
import { Link } from './entities/link.entity';

@Injectable()
export class LinkRepository {

    constructor(
        @InjectModel(Link.name)
        private readonly linkModel: Model<Link>
    ) { }

    async create(insert_link) {
        try {
            let result = await this.linkModel.create(insert_link)
            return result;
        } catch (err) {
            handleException(err)
        }
    }

    async updateOne(filter, update_data) {
        try {
          let result =  await this.linkModel.updateOne( filter , {
                $set: update_data,
            });
            if( result.matchedCount == 0){
                throw new NotFoundException('URL no encontrada.')
            }
            return true;
        } catch (err) {
            handleException(err)
        }
    }

    async findOne(filter) {
        try {
            let link = await this.linkModel.findOne(filter)
            return link
        } catch (err) {
            handleException(err)
        }

    }

}
