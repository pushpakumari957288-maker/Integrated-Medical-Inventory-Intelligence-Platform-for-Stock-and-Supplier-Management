package com.medistock.medistock.controller;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class Controller {


    @GetMapping("/public")
    public String publicApi() {
        return "this is a public  api";
    }

    @GetMapping("/private")
    public String privateApi(OAuth2AuthenticationToken token) {
        return "Authenticated"+ token.getPrincipal().getAttribute("email");

    }
}
