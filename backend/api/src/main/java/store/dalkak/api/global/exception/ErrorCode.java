package store.dalkak.api.global.exception;

public interface ErrorCode {

    int getStatusCode();

    String getErrorCode();

    String getMessage();
}
