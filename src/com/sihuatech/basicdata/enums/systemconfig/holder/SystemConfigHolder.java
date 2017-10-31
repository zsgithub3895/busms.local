
package com.sihuatech.basicdata.enums.systemconfig.holder;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import com.sihuatech.basicdata.enums.systemconfig.entity.SystemConfig;

/**
 * 
 * 负责创建系统配置实例的工厂
 */
public class SystemConfigHolder {

	/**
	 * 系统配置属性的缓存
	 */
	private Map<String, SystemConfig> configParamsMap = Collections.synchronizedMap(new HashMap<String, SystemConfig>());

	/**
	 * 根据key从缓存获取系统配置
	 * 
	 * 
	 * @param key
	 * @return
	 * @see
	 */
	public SystemConfig getSystemConfigFromCache(String key) {
		return configParamsMap.get(key);
	}

	/**
	 * 添加入缓存
	 */
	public synchronized void add(SystemConfig configParams) {
		configParamsMap.put(configParams.getKey(), configParams);
	}

	/**
	 * 删除系统配置缓存中指定的值
	 * 
	 * 
	 * @param key
	 *            系统配置属性名称
	 * @return
	 * @see
	 */
	public synchronized void remove(String key) {
		if (configParamsMap.containsKey(key)) {
			configParamsMap.remove(key);
		}
	}

}
