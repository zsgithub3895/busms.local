
package com.sihuatech.basicdata.enums.systemconfig.manager;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.onewaveinc.bumblebee.core.util.SearchResult;
import com.onewaveinc.core.db.DefaultEntityManager;
import com.onewaveinc.core.page.PageBean;
import com.onewaveinc.core.page.SearchResultHelper;
import com.sihuatech.basicdata.enums.systemconfig.entity.SystemConfig;

/**
 * 
 * 系统配置管理类
 */
public class SystemConfigManager extends DefaultEntityManager<SystemConfig, Long>{

	
	public SearchResult getSystemConfigList(String key, String value, PageBean pageBean) {
		StringBuilder hql = new StringBuilder();
		hql.append("from SystemConfig t where 1=1 ");
		if (StringUtils.isNotBlank(key)) {
			hql.append("and t.key like '"+ key+"%' ");
		}
		if (StringUtils.isNotBlank(value)) {
			hql.append("and t.value like '"+ value+"%' ");
		}
		PageBean<SystemConfig> page = this.getPage(pageBean, hql.toString(), null);
		return SearchResultHelper.create(page.getResult(), page);
	}
	
	/**
	 * 
	 * 根据ID获取系统配置实例
	 * 
	 * @param 系统配置实例
	 * @return
	 * @see
	 */
	public SystemConfig get(long id) {
		return super.get(id);
	}

	/**
	 * 
	 * 更新系统配置实例
	 * 
	 * @param 系统配置实例
	 * @return
	 * @see
	 */
	public void update(SystemConfig systemConfig) {
		super.update(systemConfig);
	}

	/**
	 * 检验库区是否存在此系统配置
	 * 
	 * @param key
	 * @return
	 */
	public boolean keyExists(String key, long id) {
		final String hql = "select sc from SystemConfig sc where sc.key = ? and sc.id = ?";
		List<SystemConfig> list = this.search(hql, new Object[] { key, id});
		return list.size() > 0 ? true : false;
	}

	/**
	 * 
	 * 根据系统配置属性名称和模块ID,取唯一的配置
	 * 
	 * @param key
	 *            配置属性名称
	 * @return SystemConfig 实例
	 * @see
	 */
	public SystemConfig getSystemConfigByKey(String key) {
		final String hql = "from SystemConfig sc where sc.key = ?";
		List<SystemConfig> list = this.search(hql, key);
		return list.size() > 0 ? list.get(0) : null;
	}

}
