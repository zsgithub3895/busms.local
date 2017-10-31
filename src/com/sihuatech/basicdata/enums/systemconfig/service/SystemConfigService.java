
package com.sihuatech.basicdata.enums.systemconfig.service;

import org.apache.commons.lang.StringUtils;

import com.onewaveinc.bumblebee.core.util.SearchResult;
import com.onewaveinc.common.annotation.bumblebee.Bean;
import com.onewaveinc.common.annotation.bumblebee.Delete;
import com.onewaveinc.common.annotation.bumblebee.Get;
import com.onewaveinc.common.annotation.bumblebee.Path;
import com.onewaveinc.common.annotation.bumblebee.Post;
import com.onewaveinc.common.annotation.bumblebee.Put;
import com.onewaveinc.common.annotation.bumblebee.Resource;
import com.onewaveinc.core.page.PageBean;
import com.sihuatech.basicdata.enums.systemconfig.entity.SystemConfig;
import com.sihuatech.basicdata.enums.systemconfig.holder.SystemConfigHolder;
import com.sihuatech.basicdata.enums.systemconfig.manager.SystemConfigManager;

/**
 * 
 * 系统配置资源
 * 

 */
@Resource("systemConfig")
@Bean("systemConfigService")
public class SystemConfigService {

	private SystemConfigManager systemConfigManager;

	private SystemConfigHolder systemConfigHolder;
	
	/**
	 * 根据条件获取配置项 并分页 W.get(systemConfig)
	 * @param key
	 * @param value
	 * @param pageBean
	 * @return
	 */
	@Get
	public SearchResult getSystemConfigList(String key, String value, PageBean pageBean) {
		
		return systemConfigManager.getSystemConfigList(key, value, pageBean);
	}
	
	/**
	 * 根据ID找配置项 W.get(systemConfig/{id})
	 * @param id
	 * @return
	 */
	@Get
	@Path("{id}")
	public SystemConfig getSystemConfigById(long id) {
		return systemConfigManager.get(id);
	}
	
	/**
	 * 保存配置项 W.create(systemConfig)
	 * @param systemConfig
	 * @throws Exception
	 */
	@Post
	public void save(SystemConfig systemConfig) throws Exception {
		if (systemConfig != null) {
			String key = systemConfig.getKey();
			if (StringUtils.isNotBlank(key)) {
				if (!keyExists(key, systemConfig.getId())) {
					throw new Exception("key已经存在");
				} else {
					systemConfigManager.save(systemConfig);
				}
			} else {
				throw new Exception("key为空");
			}

		}
	}
	
	/**
	 * 修改配置项 W.update(systemConfig)
	 * @param systemConfig
	 * @throws Exception
	 */
	@Put
	public void update(SystemConfig systemConfig) throws Exception {
		if (systemConfig != null) {
			String key = systemConfig.getKey();
			if (StringUtils.isNotBlank(key)) {
				if (!keyExists(key, systemConfig.getId())) {
					throw new Exception("key不能修改");
				} else {
					systemConfigHolder.remove(systemConfig.getKey());
					systemConfigManager.update(systemConfig);
					systemConfigHolder.add(systemConfig);
				}
			} else {
				throw new Exception("key为空");
			}
		}
	}
	
	/**
	 * 查询是否存在
	 * @param key
	 * @param id
	 * @return
	 */
	@Get
	@Path("{key}/{id}")
	public boolean keyExists(String key, long id) {
		return systemConfigManager.keyExists(key, id);
	}
	
	/**
	 * 删除配置项 
	 * @param ids
	 * @throws Exception
	 */
	@Delete
	public void delete(Long[] ids) throws Exception {
		if (ids != null && ids.length > 0) {
			SystemConfig sc = null;
			for (Long id : ids) {
				sc = systemConfigManager.get(id);
				if (sc != null) {
					systemConfigHolder.remove(sc.getKey());
					systemConfigManager.delete(sc);
				}
			}
		}
	}

	
	/**
	 * 根据key获取配置项
	 * <br>
	 * 先到缓存中找，如果没有，再查数据库
	 * @param key
	 * @return
	 */
	public SystemConfig getSystemConfigByKey(String key) {
		SystemConfig cfg = systemConfigHolder.getSystemConfigFromCache(key);
		if(null == cfg){
			cfg = systemConfigManager.getSystemConfigByKey(key);
			if(null != cfg){
				systemConfigHolder.add(cfg);
			}
		}
		return cfg;
	}
	
	public void setSystemConfigManager(SystemConfigManager systemConfigManager) {
		this.systemConfigManager = systemConfigManager;
	}

	public void setSystemConfigHolder(SystemConfigHolder systemConfigHolder) {
		this.systemConfigHolder = systemConfigHolder;
	}

}
