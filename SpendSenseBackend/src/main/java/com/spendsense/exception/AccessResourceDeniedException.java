package com.spendsense.exception;

public class AccessResourceDeniedException extends RuntimeException{

    public AccessResourceDeniedException(String resource) {
        super("Access denied to: " + resource);
    }
}
