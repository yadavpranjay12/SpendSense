package com.spendsense.service;

import com.spendsense.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class Scheduler {

    private final UserService userService;
    private final AsyncService asyncService;

    public Scheduler(UserService userService, AsyncService asyncService) {
        this.userService = userService;
        this.asyncService = asyncService;
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void reportForYesterday() {
        for (User user : userService.getAll()) {
            asyncService.execute(user.getUsername());
        }
    }
}