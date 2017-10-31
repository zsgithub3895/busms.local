package com.sihuatech.interfaceall.check.service;

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
import com.sihuatech.interfaceall.check.entity.CheckEntity;
import com.sihuatech.interfaceall.check.manage.CheckManage;
import com.sihuatech.interfaceall.interfaceconfig.manager.InterfaceConfigManager;

@Resource("checkService")
@Bean("checkService")
public class CheckService {
	private Logger logger = Logger.getInstance(CheckService.class);
	private CheckManage checkManage;
	private InterfaceConfigManager interfaceConfigManager;

	public CheckManage getCheckManage() {
		return checkManage;
	}

	public void setCheckManage(CheckManage checkManage) {
		this.checkManage = checkManage;
	}

	/**
	 * 分页条件查询
	 * 
	 * @return 查询结果
	 */
	@Get
	@SuppressWarnings("deprecation")
	public SearchResult search(String strategyname, String interfacetype, PageBean<CheckEntity> pageBean) {
		List<PropertyFilter> tmpParam = new ArrayList<PropertyFilter>();
		if (StringUtils.isNotBlank(strategyname)) {
			tmpParam.add(new PropertyFilter("strategyName", strategyname, MatchType.EQ));
		}
		if (StringUtils.isNotBlank(interfacetype)) {
			tmpParam.add(new PropertyFilter("interfaceType", interfacetype, MatchType.EQ));
		}
		pageBean = checkManage.search(pageBean, tmpParam);
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
	@Path("check")
	public boolean hasCheckCode(String strategyCode) {
		List<CheckEntity> areaList = checkManage.findByCode(strategyCode.trim());
		if (null != areaList && areaList.size() > 0) {
			return false;
		}
		return true;
	}

	/**
	 * 根据id得到校验信息
	 * 
	 * @param id
	 * @return
	 */
	@Get
	@Path("id")
	public CheckEntity getById(Long id) {
		CheckEntity p = checkManage.get(id);
		return p;
	}

	/**
	 * 更新校验信息
	 * 
	 * @param CheckEntity
	 * @return
	 */
	@Put
	public String update(CheckEntity checkEntity) {
		String msg = "";
		try {
			System.out.println("+++++++++++++++++++++++++++" + checkEntity.getId());
			CheckEntity pd = checkManage.get(checkEntity.getId());// 判断校验是否存在
			if (null != pd) {
				pd.setStrategyName(checkEntity.getStrategyName());
				pd.setInterfaceType(checkEntity.getInterfaceType());
				pd.setCheckCode(checkEntity.getCheckCode());
				pd.setCheckRule(checkEntity.getCheckRule());
				pd.setRuleValue(checkEntity.getCheckRule());
				checkManage.update(checkEntity);
				msg = "校验信息更新成功";
			} else {
				msg = "校验信息异常，更新失败";
			}
		} catch (Exception e) {
			logger.error("更新校验信息出现异常", e);
			msg = "系统异常";
			return msg;
		}

		return msg;
	}

	/**
	 * 更新时查询code是否存在
	 * 
	 * @param id
	 * @param CheckEntityCode
	 * @return
	 */
	@Get
	@Path("updateCode")
	public boolean hasSpCode(Long id, String strategyCode) {
		List<CheckEntity> list = checkManage.findByCode(strategyCode.trim(), id);
		if (null != list && list.size() > 0) {
			return false;
		}
		return true;
	}

	/**
	 * 新增校验信息
	 * 
	 * @param CheckEntity
	 * @return
	 */
	@Post
	public String add(CheckEntity checkEntity) {
		String msg = "";// 返回的信息
		try {
			checkEntity.setStrategyCode(checkEntity.getStrategyCode());
			checkEntity.setStrategyName(checkEntity.getStrategyName());
			checkEntity.setInterfaceType(checkEntity.getInterfaceType());
			checkEntity.setCheckCode(checkEntity.getCheckCode());
			checkEntity.setCheckRule(checkEntity.getCheckRule());
			checkEntity.setRuleValue(checkEntity.getRuleValue());
			checkManage.save(checkEntity);
			msg = "新建成功";
			logger.info("新增校验成功");
		} catch (Exception e) {
			logger.error("新增校验出现异常", e);
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
			List<CheckEntity> ces = new ArrayList<CheckEntity>();
			for (int i = 0; i < ids.length; i++) {
				CheckEntity pd = checkManage.get(ids[i]);// 判断校验是否存在
				String code = pd.getCheckCode();
				// 判断是否被接口绑定
				if (interfaceConfigManager.isBindCheckStrategy(code)) {
					return "存在绑定策略的接口配置！删除失败！";
				} else {
					ces.add(pd);
				}
			}
			for (CheckEntity ce : ces) {
				try {
					checkManage.delete(ce);
				} catch (Exception e) {
					logger.error("删除出现异常", e);
					msg = "系统异常";
				}
				msg = "删除成功";
			}
		} else {
			msg = "请选择要删除的校验";
		}
		return msg;
	}

	public InterfaceConfigManager getInterfaceConfigManager() {
		return interfaceConfigManager;
	}

	public void setInterfaceConfigManager(InterfaceConfigManager interfaceConfigManager) {
		this.interfaceConfigManager = interfaceConfigManager;
	}

}
