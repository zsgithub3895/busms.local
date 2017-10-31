package com.sihuatech.basicdata.enums.enums.service;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang.StringUtils;

import com.onewaveinc.bumblebee.core.util.SearchResult;
import com.onewaveinc.common.annotation.bumblebee.Bean;
import com.onewaveinc.common.annotation.bumblebee.Delete;
import com.onewaveinc.common.annotation.bumblebee.Get;
import com.onewaveinc.common.annotation.bumblebee.Path;
import com.onewaveinc.common.annotation.bumblebee.Post;
import com.onewaveinc.common.annotation.bumblebee.Put;
import com.onewaveinc.common.annotation.bumblebee.Resource;
import com.onewaveinc.core.db.PropertyFilter;
import com.onewaveinc.core.db.PropertyFilter.MatchType;
import com.onewaveinc.core.page.PageBean;
import com.onewaveinc.core.page.SearchResultHelper;
import com.onewaveinc.core.utils.ValidatorUtils;
import com.onewaveinc.mip.log.Logger;
import com.sihuatech.basicdata.enums.enums.entity.EnumItem;
import com.sihuatech.basicdata.enums.enums.entity.Enumeration;
import com.sihuatech.basicdata.enums.enums.holder.EnumerationHolder;
import com.sihuatech.basicdata.enums.enums.manager.EnumItemManager;
import com.sihuatech.basicdata.enums.enums.manager.EnumerationManager;
import com.sihuatech.basicdata.enums.util.BaseUtil;
import com.sihuatech.interfaceall.interfaceconfig.entity.InterfaceConfig;
import com.sihuatech.interfaceall.interfaceconfig.manager.InterfaceConfigManager;

/**
 * 
 * 
 * @author minghai.gao
 * @version 3.4, 2011-03-11
 * @since ICMS 3.4
 */
@Resource("enumItem")
@Bean("enumItemService")
public class EnumItemService {
	private Logger logger = Logger.getInstance(EnumItemService.class.getName());

	private static final String PUBLIC_KEY_WORD = "公用";

	private EnumerationManager enumerationManager;
	private InterfaceConfigManager interfaceConfigManager;

	public void setEnumerationManager(EnumerationManager enumerationManager) {
		this.enumerationManager = enumerationManager;
	}

	private EnumItemManager enumItemManager;

	public void setEnumItemManager(EnumItemManager enumItemManager) {
		this.enumItemManager = enumItemManager;
	}

	private EnumerationHolder enumerationHolder;

	public void setEnumerationHolder(EnumerationHolder enumerationHolder) {
		this.enumerationHolder = enumerationHolder;
	}

	/**
	 * 
	 * 根据id获取枚举值项
	 * 
	 * @param
	 * @return
	 * @see
	 */
	@Get
	@Path("{id}")
	public EnumItem getById(long id) {
		EnumItem s = enumItemManager.get(id);
		return s;
	}

	/**
	 * 
	 * 更新枚举值项
	 * 
	 * @param
	 * 
	 * @param
	 * 
	 * @return
	 * @see
	 */
	@Put
	@Path("{enumItemId}")
	public void update(long enumItemId, EnumItem enumItem) {
		EnumItem oldEnumItem = enumItemManager.get(enumItemId);
		try {
			BeanUtils.copyProperties(oldEnumItem, enumItem);
		} catch (InvocationTargetException e) {
			logger.error(e);
		} catch (IllegalAccessException e) {
			logger.error(e);
		}
		enumItemManager.update(oldEnumItem);
		enumerationHolder.refreshByItem(enumItemId);
		String description = "将id=" + enumItemId + " 的枚举值对象更新为：" + enumItem.toString();
	}

	public boolean saveEnumItem(long enumId, EnumItem enumItemBean) {
		if (existsEnumItem(enumId, enumItemBean.getCode())) {
			logger.info("枚举值项的标识" + enumItemBean.getCode() + "已存在");
			return false;
		}
		enumItemBean.setEnumId(enumId);
		enumItemBean.setStatus(Enumeration.ENUM_STATUS_NORMAL);
		enumItemBean.setReadonly(Enumeration.ENUM_READONLY_NO);
		enumItemBean.setDefaultSelected(Enumeration.ENUM_SELECT_DEFAULT_NO);
		enumItemManager.save(enumItemBean);
		enumerationHolder.refresh(enumId);
		return true;
	}

	/**
	 * 创建枚举值项
	 * 
	 * @param
	 * @return true:创建成功;false:code已存在或路径不可访问
	 * @throws StorageException
	 */
	@Post
	@Path("{enumId}")
	public long saveWithIdReturn(long enumId, EnumItem enumBeanItem) {
		boolean res = saveEnumItem(enumId, enumBeanItem);
		String description = "添加枚举值对象:" + enumBeanItem.toString();
		return res ? enumBeanItem.getId() : 0;
	}

	public boolean saveEnumSubItem(long enumId, long parentId, EnumItem enumItemBean) {
		if (existsEnumItem(enumId, enumItemBean.getCode())) {
			logger.info("枚举值项的标识" + enumItemBean.getCode() + "已存在");
			return false;
		}
		enumItemBean.setStatus(Enumeration.ENUM_STATUS_NORMAL);
		enumItemBean.setReadonly(Enumeration.ENUM_READONLY_NO);
		enumItemBean.setDefaultSelected(Enumeration.ENUM_SELECT_DEFAULT_NO);
		enumItemBean.setEnumId(enumId);
		enumItemBean.setParentid(parentId);
		enumItemManager.save(enumItemBean);
		return true;
	}

	/**
	 * 创建枚举值子项
	 * 
	 * @param
	 * @return true:创建成功;false:code已存在或路径不可访问
	 * @throws StorageException
	 */
	@Post
	@Path("{enumId}/{parentId}")
	public long savSubItemeWithIdReturn(long enumId, long parentId, EnumItem enumBeanItem) {
		enumBeanItem.setReadonly(Enumeration.ENUM_READONLY_NO);
		boolean res = saveEnumSubItem(enumId, parentId, enumBeanItem);
		String description = "为id=" + parentId + " 的枚举值添加子枚举:" + enumBeanItem.toString();
		return res ? enumBeanItem.getId() : 0;
	}

	public boolean existsEnumItem(long enumId, String code) {
		return enumItemManager.getByCode(enumId, code);
	}

	/**
	 * 根据枚举Id获取枚举项
	 * 
	 * 
	 * @param
	 * @return
	 * @see
	 */
	@Get
	@Path("enumId/{id}/{sortType}")
	public List<EnumItem> findByEnumId(long id, long sortType) {
		logger.debug("根据存储id查询绑定的枚举值项");
		List<EnumItem> list = enumItemManager.findByEnumId(id, sortType);
		if (!ValidatorUtils.listIsNull(list)) {
			return list;
		}
		return null;
	}

	/**
	 * 根据枚举项Id获取枚举子项
	 * 
	 * 
	 * @param
	 * @return
	 * @see
	 */
	@Get
	@Path("parentId/{id}")
	public List<EnumItem> findByParentId(long id) {
		logger.debug("根据存储id查询绑定的枚举值项");
		List<EnumItem> list = enumItemManager.findByParentId(id);
		if (!ValidatorUtils.listIsNull(list)) {
			return list;
		}
		return null;
	}

	/**
	 * 根据枚举项Id和type获取枚举子项
	 * 
	 * @param
	 * @return
	 * @see
	 */
	@Get
	@Path("enumParentId/{id}/{sortType}/{parentId}")
	public List<EnumItem> listByParentIdAndSortType(long id, long sortType, long parentId, String name) {
		logger.debug("根据存储id查询绑定的枚举值项");
		List<EnumItem> list = null;
		if (StringUtils.isNotBlank(name)) {
			list = enumItemManager.findByParentIdAndSortTypeAndName(id, name, parentId, sortType);
		} else {
			list = enumItemManager.findByParentIdAndSortType(id, name, parentId, sortType);
		}
		if (!ValidatorUtils.listIsNull(list)) {
			return list;
		}
		return null;
	}

	/**
	 * 根据ID,删除枚举值项
	 * 
	 * @param ids
	 * @return
	 */
	@Delete
	@Path("{enumId}")
	public boolean deleteSpace(long enumId, long[] ids) {
		for (long id : ids) {
			enumItemManager.delete(id);
			enumItemManager.deleteEnumItemByParentId(id);
			enumerationHolder.refresh(enumId);
		}
		String description = "删除id为：" + BaseUtil.toString(ids) + " 的枚举值对象";
		return true;
	}

	/**
	 * 判断枚举值唯一性
	 * 
	 * @author cx
	 * @param code
	 * @param enumId
	 * @param parentId
	 * @param id
	 * @return
	 */
	@Get
	@Path("enumItem/enumItemId/isExit/parentId/this")
	public boolean checkName(String code, long enumId, long parentId, long id) {
		boolean result = true;
		try {
			EnumItem enums = enumItemManager.isExit(enumId, code, parentId);
			if (null != enums && id != enums.getId()) {
				result = false;
			}
		} catch (Exception e) {
			logger.error("查询枚举值唯一性失败,code=" + code, e);
			result = false;
		}
		return result;
	}

	/**
	 * 判断枚举名称唯一性
	 * 
	 * @author cx
	 * @param code
	 * @param enumId
	 * @param parentId
	 * @param id
	 * @return
	 */
	@Get
	@Path("enumItem/enumItemId/isExit/parentId/name/this")
	public boolean checkName(String name, long enumId, long id) {
		boolean result = true;
		try {
			EnumItem enums = enumItemManager.nameIsExit(enumId, name);
			if (null != enums && id != enums.getId()) {
				result = false;
			}
		} catch (Exception e) {
			logger.error("查询枚举值唯一性失败,name=" + name, e);
			result = false;
		}
		return result;
	}

	@Get
	public SearchResult search(String id, String name, PageBean<EnumItem> pageBean) {
		List<PropertyFilter> properties = new ArrayList<PropertyFilter>();
		if (StringUtils.isNotBlank(name)) {
			properties.add(new PropertyFilter("name", name, MatchType.EQ));
		}
		if (StringUtils.isNotBlank(id)) {
			properties.add(new PropertyFilter("id", id, MatchType.EQ));
		}

		pageBean = enumItemManager.search(pageBean, properties);
		// pageBean.setOrderBy(providerCode);

		return SearchResultHelper.create(pageBean);
	}

	@Get
	@Path("myid/{ids}/{parentId}")
	public boolean getByID(long[] ids,long parentId) {
		if (parentId != 0) {
			Enumeration enumeration = enumerationManager.get(parentId);
			if (StringUtils.equals(enumeration.getCode(), "interfaceType")) {
				for (long id : ids) {
					String type = enumItemManager.getById(id);
					List<InterfaceConfig> list = interfaceConfigManager.getByType(type);
					if (list != null && list.size() > 0) {
						return false;
					}
				}
			} else if(StringUtils.equals(enumeration.getCode(), "businessPlatform")){
				for (long id : ids) {
					String type = enumItemManager.getById(id);
					List<InterfaceConfig> list = interfaceConfigManager.getByBussinessPlatForm(type);
					if (list != null && list.size() > 0) {
						return false;
					}
				}
			}else if (StringUtils.equals(enumeration.getCode(), "MONITOR_GROUP")) {
				for (long id : ids) {
					String group = enumItemManager.getById(id);
					List<InterfaceConfig> list = interfaceConfigManager.getByGroup(group);
					if (list != null && list.size() > 0) {
						return false;
					}
				}
			}
		} else {
			logger.warn("枚举类型的ID为空，删除无法维持数据唯一性，拒绝删除操作！");
			return false;
		}
		return true;
	}

	public void setInterfaceConfigManager(InterfaceConfigManager interfaceConfigManager) {
		this.interfaceConfigManager = interfaceConfigManager;
	}

	/**
	 * 根据Enumeration.code和EnumItem.code查询枚举值
	 * 
	 * @param enumerationCode
	 * @param enumItemCode
	 * @return
	 */
	public EnumItem getByEnumerationCodeAndEnumItemCode(String enumerationCode, String enumItemCode) {
		return enumItemManager.getByEnumerationCodeAndEnumItemCode(enumerationCode, enumItemCode);
	}

	/**
	 * 
	 * 根据code获取枚举值项
	 * 
	 * @param
	 * @return
	 * @see
	 */
	@Get
	@Path("code/{code}")
	public Map<String,String> getById(String code) {
		String[] codes=code.split("\\,");
		Map<String,String> map=new HashMap<String,String>();
		for(String cd:codes){
			String name = enumItemManager.getNameByCode(cd);
			map.put(cd,name);
		}
		return map;
	}
	
	@Get
	@Path("checkcode")
	public boolean getByCode(String code) {
		boolean b=enumItemManager.isCode(code);
		if(b){
			return false;
		}
		return true;
	}
}
