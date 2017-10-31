package com.sihuatech.user.entity;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.onewaveinc.common.security.User;

public class DefaultUser extends User{
private String passwordEncrypted;
	
	private String salt;
	
	private String system;
	private String cityId;


	public String getCityId() {
		return cityId;
	}

	public void setCityId(String cityId) {
		this.cityId = cityId;
	}

	public String getPasswordEncrypted() {
		return passwordEncrypted;
	}

	public String getSalt() {
		return salt;
	}

	public String getSystem() {
        return system;
    }

	public void setPasswordEncrypted(String passwordEncrypted) {
		this.passwordEncrypted = passwordEncrypted;
	}

    public void setSalt(String salt) {
		this.salt = salt;
	}

    public void setSystem(String system) {
        this.system = system;
    }

}