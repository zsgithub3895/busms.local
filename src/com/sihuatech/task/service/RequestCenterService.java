package com.sihuatech.task.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.PostMethod;

import com.onewaveinc.common.annotation.bumblebee.Bean;
import com.onewaveinc.mip.log.Logger;
import com.sihuatech.basicdata.area.entity.AreaBean;
import com.sihuatech.basicdata.area.manage.AreaManager;
import com.sihuatech.interfaceall.interfaceconfig.entity.InterfaceConfig;
import com.sihuatech.interfaceinfo.manager.InterfaceInfoManager;

@Bean("com.sihuatech.task.service.RequestCenterService")
public class RequestCenterService {
	private InterfaceInfoManager interfaceInfoManager;
	private AreaManager areaManager;
	private Logger logger = Logger.getInstance(RequestCenterService.class);

	public void doTask(long taskCode) {
		logger.info("定时任务开始");
		Map<String, List<InterfaceConfig>> map = getInterfaceConfig(taskCode);
		List<String> cityURL = getAreaAddress(map);
		HttpClient httpClient = new HttpClient();
		for (String url : cityURL) {
			PostMethod postMethod = new PostMethod(url);
			int statusCode;
			try {
				statusCode = httpClient.executeMethod(postMethod);
				if (statusCode == 200) {
					logger.info("调用成功！");
				} else {
					logger.error("调用失败！错误码：" + statusCode);
				}
			} catch (Exception e) {
				logger.error("调用失败", e);
			}

		}

	}

	public Map<String, List<InterfaceConfig>> getInterfaceConfig(long taskCode) {
		List<InterfaceConfig> listConfigBeans = interfaceInfoManager
				.findByTaskId(taskCode);
		Map<String, List<InterfaceConfig>> map = new HashMap<String, List<InterfaceConfig>>();
		for (InterfaceConfig in : listConfigBeans) {
			String cityCode = in.getCityCode();
			List<InterfaceConfig> ll = map.get(cityCode);
			if (null == ll) {
				ll = new ArrayList<InterfaceConfig>();
				map.put(cityCode, ll);
			}
			ll.add(in);
		}
		return map;
	}

	public List<String> getAreaAddress(Map<String, List<InterfaceConfig>> map) {
		List<String> cityURL = new ArrayList<String>();
		Iterator<String> iterator = map.keySet().iterator();
		while (iterator.hasNext()) {
			String key = iterator.next();
			List<InterfaceConfig> arrayList = map.get(key);
			StringBuffer sb =new StringBuffer();
			for (InterfaceConfig in : arrayList) {
				sb.append(in.getCode()).append(",");
			}
			List<AreaBean> list = areaManager.findByBelongCity(key);
			if (null != list && list.size() > 0) {
				AreaBean areaBean = list.get(0);
				String url = areaBean.getPostaddress() + "?interfaceCode="
						+ sb.toString();
				cityURL.add(url);
				logger.info("+++++++++++++地区通讯地址：" + url);
			}
			sb.setLength(0);
		}
		return cityURL;
	}

	public InterfaceInfoManager getInterfaceInfoManager() {
		return interfaceInfoManager;
	}

	public void setInterfaceInfoManager(
			InterfaceInfoManager interfaceInfoManager) {
		this.interfaceInfoManager = interfaceInfoManager;
	}

	public AreaManager getAreaManager() {
		return areaManager;
	}

	public void setAreaManager(AreaManager areaManager) {
		this.areaManager = areaManager;
	}

}
