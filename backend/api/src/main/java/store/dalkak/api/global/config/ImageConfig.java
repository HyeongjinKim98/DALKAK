package store.dalkak.api.global.config;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;
import javax.imageio.ImageIO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartFile;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class ImageConfig {

    private final AmazonS3 amazonS3Client;

    @Value("${cloud.aws.bucket.name}")
    private String bucketName;

    @Value("${cloud.aws.folder.custom}")
    private String folderName;

    @Value("${cloud.aws.endpoint}")
    private String endPoint;

    private BufferedImage resizeImage(BufferedImage originalImage, int targetWidth,
        int targetHeight) {
        return Scalr.resize(originalImage, Scalr.Method.AUTOMATIC, Scalr.Mode.FIT_EXACT,
            targetWidth, targetHeight, Scalr.OP_ANTIALIAS);
    }


    public String uploadImage(MultipartFile image) {
        String originalFileName = image.getOriginalFilename();
        int dot = originalFileName.lastIndexOf(".");
        String fileType = originalFileName.substring(dot + 1);
        String randomFileName = folderName + "/" + UUID.randomUUID().toString() + "." + fileType;

        try {
            BufferedImage bufferedImage = ImageIO.read(image.getInputStream());
            int height = (bufferedImage.getHeight() * 450) / bufferedImage.getWidth();
            BufferedImage resizedImage = resizeImage(bufferedImage, 450, height);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(resizedImage, fileType, outputStream);
            InputStream inputStream = new ByteArrayInputStream(outputStream.toByteArray());

            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentType(image.getContentType());
            objectMetadata.setContentLength(outputStream.toByteArray().length);
            amazonS3Client.putObject(new PutObjectRequest(bucketName, randomFileName,
                inputStream, objectMetadata).withCannedAcl(
                CannedAccessControlList.PublicRead));
            return endPoint + "/" + bucketName + "/" + randomFileName;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public void deleteImage(String imageUrl) {
        int slash = imageUrl.lastIndexOf("/");
        String prefix = folderName + "/" + imageUrl.substring(slash + 1);
        try {
            amazonS3Client.deleteObject(bucketName, prefix);
        } catch (AmazonS3Exception e) {
            e.printStackTrace();
        }
    }
}
