package com.sihuatech.interfaceall.interfaceconfig.service;

import java.util.ArrayList;
import java.util.List;

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
import com.onewaveinc.mip.log.Logger;
import com.sihuatech.datastatus.entity.DataRecordStatus;
import com.sihuatech.datastatus.manager.DataRecordStatusManager;
import com.sihuatech.interfaceall.interfaceconfig.entity.InterfaceConfig;
import com.sihuatech.interfaceall.interfaceconfig.manager.InterfaceConfigManager;

@Resource("interfaceConfigManageService")
@Bean("com.sihuatech.InterfaceConfigManageService")
public class InterfaceConfigManageService {
	private Logger logger = Logger.getInstance(InterfaceConfigManageService.class);
	private InterfaceConfigManager interfaceConfigManager;
	private DataRecordStatusManager dataRecordStatusManager;

	public void setDataRecordStatusManager(DataRecordStatusManager dataRecordStatusManager) {
		this.dataRecordStatusManager = dataRecordStatusManager;
	}

	public void setInterfaceConfigManager(InterfaceConfigManager interfaceConfigManager) {
		this.interfaceConfigManager = interfaceConfigManager;
	}

	/**
	 * 
	 * @param interfaceName
	 * @param belongCity
	 * @param pageBean
	 * @return
	 */
	@Get
	public SearchResult search(String type, String cityCode, PageBean<InterfaceConfig> pageBean) {
		List<PropertyFilter> properties = new ArrayList<PropertyFilter>();
		if(null == type && null == cityCode){
			pageBean =  interfaceConfigManager.getAll(pageBean);
			return SearchResultHelper.create(pageBean);
		}
		if ("ALLCITYCODE".equals(cityCode) && "ALLTYPE".equals(type)) {
			pageBean =  interfaceConfigManager.getAll(pageBean);
			return SearchResultHelper.create(pageBean);
		}else if(!"ALLCITYCODE".equals(cityCode) && "ALLTYPE".equals(type)){
			properties.add(new PropertyFilter("cityCode", cityCode, MatchType.EQ));
		}else if("ALLCITYCODE".equals(cityCode) && !"ALLTYPE".equals(type)){
			properties.add(new PropertyFilter("type", type, MatchType.EQ));
		}else if(!"ALLCITYCODE".equals(cityCode) && !"ALLTYPE".equals(type)){
			properties.add(new PropertyFilter("type", type, MatchType.EQ));
			properties.add(new PropertyFilter("cityCode", cityCode, MatchType.EQ));
		}
		pageBean = interfaceConfigManager.search(pageBean, properties);
		return SearchResultHelper.create(pageBean);
	}

	/**
	 * 根据id得到地区信息
	 * 
	 * @param id
	 * @return
	 */
	@Get
	@Path("id")
	public InterfaceConfig getById(Long id) {
		InterfaceConfig ifconfig = interfaceConfigManager.get(id);
		return ifconfig;
	}

	@Get
	@Path("idInterface/{cityCode}/{type}")
	public List<InterfaceConfig> getInterfaceConfig(String cityCode,String type) {
		List<InterfaceConfig> configlist = null;
		if("ALL".equals(type) && "0".equals(cityCode)){
			configlist = interfaceConfigManager.getAllByGroup();
		}else if("ALL".equals(type) && !"0".equals(cityCode)) {
			configlist = interfaceConfigManager.getByCityCode(cityCode);
		} else if(!"ALL".equals(type) && "0".equals(cityCode)){
			configlist = interfaceConfigManager.getByType(type);
		}else{
			configlist = interfaceConfigManager.getByCityCodeAndType(cityCode,type);
		}
		return configlist;
	}
	@Get
    @Path("add")
	public boolean identyCode(String code){
		return interfaceConfigManager.indentyCode(code);	
	 }
	
	@Get
	@Path("updateCode")
	public boolean hasSpCode(Long id, String code) {
		List<InterfaceConfig> list = interfaceConfigManager.findByCode(code.trim(), id);
		if (null != list && list.size() > 0) {
			return false;
		}
		return true;
	}
	/**
	 * 删除接口配置
	 */
	@Delete
	public String del(Long[] ids) {
		String msg = "";
		if (ids.length > 0) {
			List<Long> list = new ArrayList<Long>();
			for (int i = 0; i < ids.length; i++) {
				InterfaceConfig interfaceConfigBean = interfaceConfigManager.get(ids[i]);
				if (null != interfaceConfigBean) {
					list.add(ids[i]);
				}
			}
			if (list.size() > 0) {
				for (Long long1 : list) {
					interfaceConfigManager.delete(long1);
					logger.info("删除id为：" + long1 + "的数据成功");
				}
				msg = "删除成功";
			} else {
				msg = "选择的接口配置不存在，删除失败";
			}
		} else {
			msg = "请选择要删除的接口配置。";
		}
		return msg;
	}

	/**
	 * 
	 * @param areaBean
	 * @return
	 */
	@Post
	public String add(InterfaceConfig interfaceConfigBean) {
		String msg = "";// 返回的信息
		try {
			interfaceConfigManager.save(interfaceConfigBean);
			msg = "新建成功";
			logger.info("添加接口信息成功");
		} catch (Exception e) {
			logger.error("添加接口信息异常", e);
			msg = "系统异常";
			return msg;
		}

		return msg;
	}

	/**
	 * 更新接口配置信息
	 * 
	 * @param areaBean
	 * @return
	 */
	@Put
	public String update(InterfaceConfig interfaceConfigBean) {
		String msg = "";
		try {
			// 判断接口配置是否存在
			InterfaceConfig interfaceConfigBean2 = interfaceConfigManager.get(interfaceConfigBean.getId());
			if (null != interfaceConfigBean2) {
				interfaceConfigBean.setId(interfaceConfigBean2.getId());
				interfaceConfigManager.update(interfaceConfigBean);
				
				/**更新状态表相关内容*/
				String interfaceCode = interfaceConfigBean.getCode();
				DataRecordStatus drs = dataRecordStatusManager.getDataRecordStatusByCode(interfaceCode);
				if (drs != null) {
					drs.setCityCode(interfaceConfigBean.getCityCode());
					drs.setInterfaceName(interfaceConfigBean.getName());
					drs.setInterfaceType(interfaceConfigBean.getType());
					drs.setMonitorGroup(interfaceConfigBean.getMonitorGroup());
					dataRecordStatusManager.update(drs);
				}
				msg = "接口信息更新成功";
			} else {
				msg = "接口信息异常，更新失败";
			}
		} catch (Exception e) {
			logger.error("更新接口信息出现异常", e);
			msg = "系统异常";
			return msg;
		}

		return msg;
	}
}
