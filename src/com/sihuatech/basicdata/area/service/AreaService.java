package com.sihuatech.basicdata.area.service;

import java.util.ArrayList;
import java.util.List;

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
import com.onewaveinc.mip.log.Logger;
import com.sihuatech.basicdata.area.entity.AreaBean;
import com.sihuatech.basicdata.area.manage.AreaManager;
import com.sihuatech.interfaceall.interfaceconfig.manager.InterfaceConfigManager;
import com.sihuatech.user.manager.UserManager;

@Resource("areaService")
@Bean("areaService")
public class AreaService {
	private Logger logger = Logger.getInstance(AreaService.class);
	private AreaManager areaManager;
	private UserManager userManager;
	private InterfaceConfigManager interfaceConfigManager;

	public AreaManager getAreaManager() {
		return areaManager;
	}

	public void setAreaManager(AreaManager areaManager) {
		this.areaManager = areaManager;
	}

	/**
	 * 分页条件查询
	 * 
	 * @return 查询结果
	 */
	@Get
	@SuppressWarnings("deprecation")
	public SearchResult search(String name, String code,
			PageBean<AreaBean> pageBean) {

		List<PropertyFilter> tmpParam = new ArrayList<PropertyFilter>();
		if (StringUtils.isNotBlank(name)) {
			tmpParam.add(new PropertyFilter("name", name, MatchType.LIKE));
		}
		if (StringUtils.isNotBlank(code)) {
			tmpParam.add(new PropertyFilter("code", code, MatchType.EQ));
		}
		pageBean = areaManager.search(pageBean, tmpParam);
		pageBean.setOrder("asc");
		pageBean.setOrderBy("id");
		return SearchResultHelper.create(pageBean);
	}

	/**
	 * 新增的时候判断code是否存在
	 * 
	 * @param Code
	 * @return 存在返回false ，不存在返回true
	 */
	@Get
	@Path("areaCode")
	public boolean hasAreaCode(String code) {
		List<AreaBean> areaList = areaManager.findByCode(code.trim());
		if (null != areaList && areaList.size() > 0) {
			return false;
		}
		return true;
	}

	/**
	 * 根据id得到地区信息
	 * 
	 * @param id
	 * @return
	 */
	@Get
	@Path("id")
	public AreaBean getById(Long id) {
		AreaBean p = areaManager.get(id);
		return p;
	}

	/**
	 * 判断地区是否被用户或接口绑定
	 * 
	 * @param code
	 * @return
	 */
	@Get
	@Path("areaUser/{ids}")
	public AreaReturn userAndInterface(Long[] ids) {
		 AreaReturn ar=new AreaReturn();
		if (ids.length > 0) {
			for (int i = 0; i < ids.length; i++) {
				AreaBean pd = areaManager.get(ids[i]);// 判断地区是否存在
				if (null != pd) {
					boolean b1 = userManager.getByCitycode(pd.getCode());
					boolean b2 = interfaceConfigManager.isByCitycode(pd
							.getCode());
					 if(b1){
						ar.setFlag(true);
						ar.setMsg("地区"+pd.getName()+"被用户绑定不能删除！");
						return ar;
					}else if(b2){
						ar.setFlag(true);
						ar.setMsg("地区"+pd.getName()+"被接口绑定不能删除！");
						return ar;
					}
				}
			}
		}
		ar.setFlag(false);
		ar.setMsg("删除成功！");
		return ar;
	}

	/**
	 * 更新地区信息
	 * 
	 * @param areaBean
	 * @return
	 */
	@Put
	public String update(AreaBean areaBean) {
		String msg = "";
		try {
			AreaBean pd = areaManager.get(areaBean.getId());// 判断地区是否存在
			if (null != pd) {
				pd.setName(areaBean.getName());
				pd.setDescription(areaBean.getDescription());
				pd.setPostaddress(areaBean.getPostaddress());
				areaManager.update(areaBean);
				msg = "地区信息更新成功";
			} else {
				msg = "地区信息异常，更新失败";
			}
		} catch (Exception e) {
			logger.error("更新地区信息出现异常", e);
			msg = "系统异常";
			return msg;
		}

		return msg;
	}

	/**
	 * 更新时查询code是否存在
	 * 
	 * @param id
	 * @param areaBeanCode
	 * @return
	 */
	@Get
	@Path("updateCode")
	public boolean hasSpCode(Long id, String code) {
		List<AreaBean> list = areaManager.findByCode(code.trim(), id);
		if (null != list && list.size() > 0) {
			return false;
		}
		return true;
	}

	/**
	 * 新增地区信息
	 * 
	 * @param areaBean
	 * @return
	 */
	@Post
	public String add(AreaBean areaBean) {
		String msg = "";// 返回的信息
		try {
			areaBean.setName(areaBean.getName());
			areaBean.setCode(areaBean.getCode());
			areaBean.setDescription(areaBean.getDescription());
			areaBean.setPostaddress(areaBean.getPostaddress());
			areaManager.save(areaBean);
			msg = "新建成功";
			logger.info("新增地区成功");
		} catch (Exception e) {
			logger.error("新增地区出现异常", e);
			msg = "系统异常";
			return msg;
		}

		return msg;
	}

	/*
	 * 批量做逻辑删除
	 * 
	 * @param ids
	 * 
	 * @return
	 */
	@Delete
	public String del(Long[] ids) {
		String msg = "";
		if (ids.length > 0) {
			for (int i = 0; i < ids.length; i++) {
				AreaBean pd = areaManager.get(ids[i]);// 判断地区是否存在
				if (null != pd) {
					try {
						areaManager.delete(pd);
					} catch (Exception e) {
						logger.error("删除出现异常", e);
						msg = "系统异常";
					}
					msg = "删除成功";
				}
			}
		} else {
			msg = "请选择要删除的地区";
		}
		return msg;
	}

	public UserManager getUserManager() {
		return userManager;
	}

	public void setUserManager(UserManager userManager) {
		this.userManager = userManager;
	}

	public InterfaceConfigManager getInterfaceConfigManager() {
		return interfaceConfigManager;
	}

	public void setInterfaceConfigManager(
			InterfaceConfigManager interfaceConfigManager) {
		this.interfaceConfigManager = interfaceConfigManager;
	}

}
