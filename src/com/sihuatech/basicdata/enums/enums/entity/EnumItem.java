package com.sihuatech.basicdata.enums.enums.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 
 */
@Entity
@Table(name = "COMMON_ENUM_ITEM")
public class EnumItem implements Comparable<EnumItem> {
	
	/**
	 * Id
	 */
	private long id;
	/**
	 * 如果有多级枚举，表示上一级的Id，如果为0，表示是第一级枚举
	 */
	private long parentid;
	/**
	 * 枚举Id，如果为0，表示是第二级或以后的枚举条目
	 */
	private long enumId;
	/**
	 * 值
	 */
	private String code;
	/**
	 * 名
	 */
	private String name;
	/**
	 * 状态
	 */
	private int status;
	/**
	 *描述
	 */
	private String description;
	/**
	 * 序号
	 */
	private long sortIndex;
	/**
	 * 默认选中与否
	 */
	private int defaultSelected;
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

	@Column(name = "PARENT_ID")
	public long getParentid() {
		return parentid;
	}

	public void setParentid(long parentid) {
		this.parentid = parentid;
	}

	@Column(name = "CODE")
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "STATUS")
	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	@Column(name = "DESCRIPTION")
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Column(name = "SORT_INDEX")
	public long getSortIndex() {
		return sortIndex;
	}

	public void setSortIndex(long sortIndex) {
		this.sortIndex = sortIndex;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Column(name = "ENUM_ID")
	public long getEnumId() {
		return enumId;
	}

	public void setEnumId(long enumId) {
		this.enumId = enumId;
	}

	@Column(name = "NAME")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "DEFAULT_SELECTED")
	public int getDefaultSelected() {
		return defaultSelected;
	}

	public void setDefaultSelected(int defaultSelected) {
		this.defaultSelected = defaultSelected;
	}

	@Column(name = "READ_ONLY")
	public int getReadonly() {
		return readonly;
	}

	public void setReadonly(int readonly) {
		this.readonly = readonly;
	}

	public int compareTo(EnumItem o) {
		if (sortIndex > o.getSortIndex()) {
			return 1;
		} else if (sortIndex < o.getSortIndex()) {
			return -1;
		}
		return 0;
	}

	@Override
	public String toString() {
		return "EnumItem [id=" + id + ", parentid=" + parentid + ", enumId="
				+ enumId + ", code=" + code + ", name=" + name + ", status="
				+ status + ", description=" + description + ", sortIndex="
				+ sortIndex + ", defaultSelected=" + defaultSelected
				+ ", readonly=" + readonly + "]";
	}

}
