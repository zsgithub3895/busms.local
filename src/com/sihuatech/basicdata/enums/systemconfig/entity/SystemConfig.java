package com.sihuatech.basicdata.enums.systemconfig.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

/**
 * 系统配置
 * 
 */
@Entity
@Table(name = "COMMON_SYSTEMCONFIG")
public class SystemConfig implements Serializable {

	private static final long serialVersionUID = 3035445235461571457L;
	
	
	public static final int CONFIG_READONLY_NO = 1;
	public static final int CONFIG_READONLY_YES = 2;
	
	private long id;

	/**
	 * 系统配置某一个属性的名称
	 */
	private String key;

	/**
	 * 系统配置某一个属性的值
	 */
	private String value;

	/**
	 * 描述
	 */
	private String description;
	/**
	 * 是否只读
	 */
	private int readonly;

	@Id
	@GenericGenerator(name="mysql", strategy="increment")
	@GeneratedValue(generator="mysql")
	@Column(name = "ID", unique = true, nullable = false)
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	@Column(name = "CODE")
	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}
	@Column(name = "VALUE")
	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
	@Column(name = "DESCRIPTION", length = 128)
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	@Column(name = "READ_ONLY")
	public int getReadonly() {
		return readonly;
	}

	public void setReadonly(int readonly) {
		this.readonly = readonly;
	}
}
