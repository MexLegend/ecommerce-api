import { Injectable } from '@nestjs/common';
import { v2, DeleteApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {

  async deleteImages(publidIds: string[]): Promise<DeleteApiResponse> {
    return new Promise((resolve, reject) => {
      v2.api.delete_resources(publidIds, (error, result) => {
        if (error) {
          console.log(error);

          return reject(error);
        }
        resolve(result);
      });
    });
  }
}
