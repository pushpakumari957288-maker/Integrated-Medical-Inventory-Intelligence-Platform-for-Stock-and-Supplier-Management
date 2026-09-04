package com.medistock.dto;

public class LoginResponse {

    private String token;
    private Integer userId;
    private String username;
    private Integer roleId;

    public LoginResponse() {
    }

    public LoginResponse(String token, Integer userId, String username, Integer roleId) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.roleId = roleId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }
}
    

