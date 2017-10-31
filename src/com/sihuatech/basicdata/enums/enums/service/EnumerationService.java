package com.sihuatech.basicdata.enums.enums.service;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.collections.CollectionUtils;

import com.onewaveinc.bumblebee.core.util.SearchResult;
import com.onewaveinc.common.annotation.bumblebee.Bean;
import com.onewaveinc.common.annotation.bumblebee.Delete;
import com.onewaveinc.common.annotation.bumblebee.Get;
import com.onewaveinc.common.annotation.bumblebee.Path;
import com.onewaveinc.common.annotation.bumblebee.Post;
import com.onewaveinc.common.annotation.bumblebee.Put;
import com.onewaveinc.common.annotation.bumblebee.Resource;
import com.onewaveinc.core.page.PageBean;
import com.onewaveinc.core.utils.ValidatorUtils;
import com.onewaveinc.mip.log.Logger;
import com.sihuatech.basicdata.enums.enums.entity.EnumItem;
import com.sihuatech.basicdata.enums.enums.entity.Enumeration;
import com.sihuatech.basicdata.enums.enums.holder.EnumerationHolder;
import com.sihuatech.basicdata.enums.enums.manager.EnumItemManager;
import com.sihuatech.basicdata.enums.enums.manager.EnumerationManager;
import com.sihuatech.basicdata.enums.util.BaseUtil;
/**
 * 获取枚举值服务类
 */
@Resource("enum")
@Bean("enumerationService")
public class EnumerationService {

	private Logger logger = Logger.getInstance(EnumerationService.class.getName());

	private EnumerationManager enumerationManager;
	
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
	 * 查询枚举值
	 * 
	 * @param
	 * @return
	 * @see
	 */
	@Get
	public SearchResult getAllStorage(String name, String code, PageBean<Enumeration> pageBean) {
		
		return enumerationManager.getAllStorage(name, code, pageBean);
	}

	/**
	 * 
	 * 根据id获取枚举值
	 * 
	 * @param
	 * @return
	 * @see
	 */
	@Get
	@Path("edit/{id}")
	public Enumeration getById(long id) {
		Enumeration s = enumerationManager.get(id);
		return s;
	}

	/**
	 * 
	 * 根据code获取枚举值
	 * 
	 * @param
	 * @return
	 * @see
	 */
	@Get
	@Path("{code}")
	public Map<String, String> getByCode(String code) {
		List<EnumItem> enumItemList = enumerationHolder.getEnumsFromCache(code);
		Map<String, String> map = new HashMap<String, String>();
		if (enumItemList == null) {
			Enumeration enumeration = enumerationManager.getEnumByCode(code);
			// 如果是多级枚举，需要再传入一个参数parentId，以判断是第几级
			enumItemList = new ArrayList<EnumItem>();
			if (null != enumeration) {
				enumItemList = enumItemManager.listByEnumIdAndParentId(enumeration.getId(), 0);
			}
			enumerationHolder.add(code, enumItemList);
		}
		if (!ValidatorUtils.listIsNull(enumItemList)) {
			for (EnumItem e : enumItemList) {
				map.put(e.getCode(), e.getName());
			}
		}
		return map;
	}
	
	/**
	 * 
	 * 根据code获取枚举值，枚举值排序
	 * 
	 * @param
	 * @return
	 * @see
	 */
	@Get
	@Path("sort/{code}")
	public List<EnumItem> getSortByCode(String code) {
		List<EnumItem> enumItemList = enumerationHolder.getEnumsFromCache(code);
		if (enumItemList == null) {
			// 如果是多级枚举，需要再传入一个参数parentId，以判断是第几级
			Enumeration enumeration = enumerationManager.getEnumByCode(code);
			enumItemList = new ArrayList<EnumItem>();
			if (null != enumeration) {
				enumItemList = enumItemManager.listByEnumIdAndParentId(enumeration.getId(), 0);
			}
			enumerationHolder.add(code, enumItemList);
		}
		Collections.sort(enumItemList);
		return enumItemList;
	}
	
	private void getEnumItemByParentId(List<EnumItem> enumItems, long parentId) {
		List<EnumItem> list = enumItemManager.findByParentId(parentId);
		if (CollectionUtils.isNotEmpty(list)) {
			if (list != null && list.size() > 0) {
				for (EnumItem enumItem : list) {
					enumItems.add(enumItem);
					getEnumItemByParentId(enumItems, enumItem.getId());
				}
			}
		}
	}
	
	/**
	 * 
	 * 更新枚举值
	 * 
	 * @param
	 * 
	 * @param
	 * 
	 * @return
	 * @see
	 */
	@Put
	@Path("{id}")
	public void update(long id, Enumeration enumBean) {
		Enumeration oldEnum = enumerationManager.get(id);
		try {
			BeanUtils.copyProperties(oldEnum, enumBean);
		} catch (InvocationTargetException e) {
			logger.error(e);
		} catch (IllegalAccessException e) {
			logger.error(e);
		}
		enumerationManager.update(oldEnum);
		String description = "将id="+id+" 的枚举对象更新为："+enumBean.toString();
	}

	/**
	 * 创建枚举值
	 * 
	 * @param
	 * @return true:创建成功;false:code已存在或路径不可访问
	 * @throws StorageException
	 */
	public boolean saveEnum(Enumeration enumBean){
		if (existsEnum(enumBean.getCode())) {
			logger.info("枚举值标识" + enumBean.getCode() + "已存在");
			return false;
		}
		enumerationManager.save(enumBean);
		String description = "添加枚举对象:"+enumBean.toString();
		return true;
	}

	@Post
	public long saveWithIdReturn(Enumeration enumBean){
		if(enumBean.getReadonly() == 0){
			enumBean.setReadonly(2);
		}
		boolean res = saveEnum(enumBean);
		return res ? enumBean.getId() : 0;
	}

	public boolean existsEnum(String code) {
		return enumerationManager.getByCode(code);
	}

	/**
	 * 删除枚举
	 * @param ids
	 * @return
	 */
	@Delete
	@Path("deleteEnums/{ids}")
	public boolean deleteEnums(long[] ids){
		for (long id : ids) {
			enumItemManager.deleteEnumItemByEnumId(id);
			enumerationManager.delete(id);
		}
		String description = "删除id为："+BaseUtil.toString(ids)+" 的枚举对象及其子枚举";
		return true;
	}
}
