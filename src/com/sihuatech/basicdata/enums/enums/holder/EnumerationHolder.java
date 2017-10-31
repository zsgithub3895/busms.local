package com.sihuatech.basicdata.enums.enums.holder;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sihuatech.basicdata.enums.enums.entity.EnumItem;
import com.sihuatech.basicdata.enums.enums.entity.Enumeration;
import com.sihuatech.basicdata.enums.enums.manager.EnumItemManager;
import com.sihuatech.basicdata.enums.enums.manager.EnumerationManager;



/**
 * 负责保存enum值的实例工厂
 */
public class EnumerationHolder {
	
	private EnumerationManager enumerationManager;
	
	public void setEnumerationManager(EnumerationManager enumerationManager) {
		this.enumerationManager = enumerationManager;
	}
	
	private EnumItemManager enumItemManager;

	public void setEnumItemManager(EnumItemManager enumItemManager) {
		this.enumItemManager = enumItemManager;
	}

	/**
	 * 系统配置属性的缓存
	 */
	private Map<String, List<EnumItem>> enumParamsMap = Collections.synchronizedMap(new HashMap<String, List<EnumItem>>());
	
	/**
	 * 根据key从缓存获取enums值
	 * 
	 * 
	 * @param key
	 * @return
	 * @see
	 */
	public List<EnumItem> getEnumsFromCache(String key) {
		return enumParamsMap.get(key);
	}

	/**
	 * 添加入缓存
	 */
	public synchronized void add(String key,List<EnumItem> enums) {
		enumParamsMap.put(key, enums);
	}

	/**
	 * 删除系统enums缓存中指定的值
	 * 
	 * 
	 * @param key
	 *            系统配置属性名称
	 * @return
	 * @see
	 */
	public synchronized void remove(String key) {
		if (enumParamsMap.containsKey(key)) {
			enumParamsMap.remove(key);
		}
	}
	
	/**
	 * 根据enum的id刷新缓存
	 * 
	 * @param enumItemId
	 */
	public void refresh(long enumId) {
		Enumeration enumeration = enumerationManager.get(enumId);
		List<EnumItem> enumItemList = enumItemManager.listByEnumIdAndParentId(enumeration.getId(), 0);
		add(enumeration.getCode(), enumItemList);
	}
	
	/**
	 * 根据enumitem的id刷新缓存
	 * 
	 * @param enumItemId
	 */
	public void refreshByItem(long enumItemId) {
		EnumItem item = enumItemManager.get(enumItemId);
		Enumeration enumeration = enumerationManager.get(item.getEnumId());
		List<EnumItem> enumItemList = enumItemManager.listByEnumIdAndParentId(item.getEnumId(), 0);
		add(enumeration.getCode(), enumItemList);
	}
}
