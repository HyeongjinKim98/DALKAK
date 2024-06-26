package store.dalkak.api.global.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import lombok.extern.slf4j.Slf4j;
import store.dalkak.api.global.oauth.dto.OIDCDto;
import store.dalkak.api.global.util.exception.UtilErrorCode;
import store.dalkak.api.global.util.exception.UtilException;

@Slf4j
public class DecodeUtil {

    public static OIDCDto payloadDecoder(String jwtPayload) {
        try {
            String payload = new String(Base64.getUrlDecoder().decode(jwtPayload));
            ObjectMapper mapper = new ObjectMapper().configure(
                DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES, false);
            return mapper.readValue(payload, OIDCDto.class);
        } catch (JsonProcessingException e) {
            throw new UtilException(UtilErrorCode.DECODE_ERROR);
        }
    }

    public static String urlDecoder(String target) {
        return URLDecoder.decode(target, StandardCharsets.UTF_8);
    }
}
