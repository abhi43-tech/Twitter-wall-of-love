import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageUploadService {
  private readonly s3Client: S3Client;
  private userBucket: string;
  private wallBucket: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('S3_REGION'),
      endpoint: this.configService.get('S3_ENDPOINT'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('S3_SECRET_KEY'),
      },
    });

    this.userBucket = 'twitter';
    this.wallBucket = 'walls';
  }

  async uploadUserImage(image: Buffer): Promise<string> {
    const key = String(Date.now());

    const command = {
      Bucket: this.userBucket,
      Key: key,
      Body: image,
      ContentType: 'image/png',
    };

    await this.s3Client.send(new PutObjectCommand(command));

    return `${this.configService.get('MINIO_ENDPOINT')}/${this.userBucket}/${key}`;
  }

  async uploadWallLogo(logo: Buffer): Promise<string> {
    const key = String(Date.now());

    const command = {
      Bucket: this.wallBucket,
      Key: key,
      Body: logo,
      ContentType: 'image/png',
    };

    await this.s3Client.send(new PutObjectCommand(command));

    return `${this.configService.get('MINIO_ENDPOINT')}/${this.wallBucket}/${key}`;
  }

  async deleteUserImage(imageURL: string) {
    const key = imageURL.split('/')[4];
 
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.userBucket,
        Key: key,
      }),
    );
  }

  async deleteWallLogo(logoURL: string) {
    const key = logoURL.split('/')[4];

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.wallBucket,
        Key: key,
      }),
    );
  }
}