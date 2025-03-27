package com.main.omniplanner.requests;

public class UpdateUserRequest {
    public String name;
    public String phone;
    public String age;
    public String password;

    public UpdateUserRequest(String name, String phone, String age, String password) {
        this.name = name;
        this.phone = phone;
        this.age = age;
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
