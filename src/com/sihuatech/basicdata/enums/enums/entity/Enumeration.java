package com.sihuatech.basicdata.enums.enums.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 
 * enums实体类
 */
@Entity
@Table(name = "COMMON_ENUM")
public class Enumeration {
	
	public static final int ENUM_READONLY_NO = 1;
	public static final int ENUM_READONLY_YES = 2;
	
	public static final int ENUM_STATUS_NORMAL = 1;
	public static final int ENUM_STATUS_PAUSE = 2;
	public static final int ENUM_STATUS_STOP = 3;
	
	public static final int ENUM_SELECT_DEFAULT_NO = 1;
	public static final int ENUM_SELECT_DEFAULT_YES = 2;
	
	/**
	 * Id
	 */
	private long id;
	/**
	 * 名称
	 */
	private String name;
	/**
	 * 标识
	 */
	private String code;
	/**
	 * 说明
	 */
	private String description;
	/**
	 * 是否只读
	 */
	private int readonly;
	
	@Id
	@GeneratedValue
	@Column(name = "ID", unique = true, nullable = false, precision = 18, scale = 0)
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Column(name = "NAME")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "CODE")
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "DESCRIPTION")
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

	@Override
	public String toString() {
		return "Enumeration [id=" + id + ", name=" + name + ", code=" + code
				+ ", description=" + description + ", readonly=" + readonly
				+ "]";
	}
}
