package store.dalkak.api.global.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Base64;
import lombok.extern.slf4j.Slf4j;
import store.dalkak.api.global.oauth.dto.OIDCDto;

@Slf4j
public class DecodeUtil {

    public static String payloadDecoder(String jwtPayload) {
        try {
            String payload = new String(Base64.getUrlDecoder().decode(jwtPayload));
            ObjectMapper mapper = new ObjectMapper().configure(
                DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES, false);
            return mapper.readValue(payload, OIDCDto.class).getSub();
        } catch (JsonProcessingException e) {
//            throw new UtilException(UtilErrorCode.DECODE_ERROR);
        }
        return null;
    }

    public static String urlDecoder(String target) {
        try {
            return URLDecoder.decode(target, "UTF-8");
        } catch (UnsupportedEncodingException e) {
//            throw new UtilException(UtilErrorCode.DECODE_ERROR);
        }
        return null;

    }
}
