import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import {
  cfAccountId,
  r2AccessKey,
  r2Bucket,
  r2Domain,
  r2Region,
  r2SecretKey,
} from "@pintudesa/env"

export const r2Config = {
  region: r2Region ?? "auto",
  endpoint: `https://${cfAccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2AccessKey ?? "",
    secretAccessKey: r2SecretKey ?? "",
  },
}

export const r2Client = new S3Client(r2Config)

interface UploadFileToR2Props {
  file: Buffer
  fileName: string
  contentType: string
}

export async function uploadFileToR2({
  file,
  fileName,
  contentType,
}: UploadFileToR2Props): Promise<string> {
  const params = {
    Bucket: r2Bucket,
    Key: fileName,
    Body: file,
    ContentType: contentType,
  }

  const command = new PutObjectCommand(params)
  await r2Client.send(command)

  return fileName
}

export async function deleteFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: r2Bucket,
    Key: key,
  })

  await r2Client.send(command)
}

export function generateR2Key(prefix: string, filename: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_")
  return `${prefix}/${timestamp}-${randomString}-${cleanFilename}`
}

export function getR2PublicUrl(key: string): string {
  if (r2Domain) {
    return `${r2Domain}/${key}`
  }
  return `https://${r2Bucket}.r2.cloudflarestorage.com/${key}`
}
