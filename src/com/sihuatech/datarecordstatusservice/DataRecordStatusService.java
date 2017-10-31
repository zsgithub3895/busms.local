package com.sihuatech.datarecordstatusservice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.onewaveinc.bumblebee.core.util.SearchResult;
import com.onewaveinc.common.annotation.bumblebee.Bean;
import com.onewaveinc.common.annotation.bumblebee.Get;
import com.onewaveinc.common.annotation.bumblebee.Path;
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

@Resource("DataRecordStatusService")
@Bean("com.sihuatech.DataRecordStatusService")
public class DataRecordStatusService {
	private Logger logger = Logger.getInstance(DataRecordStatusService.class);
	private DataRecordStatusManager dataRecordStatusManager;
	private InterfaceConfigManager interfaceConfigManager;

	public void setDataRecordStatusManager(
			DataRecordStatusManager dataRecordStatusManager) {
		this.dataRecordStatusManager = dataRecordStatusManager;
	}

	@Get
	public SearchResult search(String cityCode, String interfaceVarity,
			PageBean<DataRecordStatus> pageBean) {
		List<PropertyFilter> properties = new ArrayList<PropertyFilter>();
		if (StringUtils.isNotBlank(cityCode)) {
			properties.add(new PropertyFilter("cityCode", cityCode,
					MatchType.EQ));
		}
		if (cityCode.equals("all")) {
			pageBean = dataRecordStatusManager.search(pageBean, properties);
			return SearchResultHelper.create(pageBean);
		}
		if (StringUtils.isNotBlank(interfaceVarity)) {
			properties.add(new PropertyFilter("interfaceVarity",
					interfaceVarity, MatchType.EQ));
		}
		pageBean = dataRecordStatusManager.search(pageBean, properties);
		// pageBean.setOrderBy(providerCode);

		return SearchResultHelper.create(pageBean);
	}

	@Get
	@Path("status/{codeArray}")
	public Map<String, ArrayList<DataRecordStatus>> getInterfaceStatus(
			String codeArray) {
		Map<String, ArrayList<DataRecordStatus>> map = new HashMap<String, ArrayList<DataRecordStatus>>();
		String[] codes = codeArray.split("\\,");
		for (String code : codes) {
			DataRecordStatus drs = dataRecordStatusManager
					.getDataRecordStatusByCode(code);
			if (null != drs) {
				ArrayList<DataRecordStatus> ll = map.get(drs.getMonitorGroup());
				if (null == ll) {
					ll = new ArrayList<DataRecordStatus>();
					map.put(drs.getMonitorGroup(), ll);
				}
				ll.add(drs);
			} else {
				DataRecordStatus drs2 = new DataRecordStatus();
				InterfaceConfig con = interfaceConfigManager.getByCode(code);
				drs2.setInterfaceName(con.getName());
				drs2.setInterfaceCode(con.getCode());
				drs2.setRespCorrect(0);
				drs2.setMonitorGroup(con.getMonitorGroup());
				ArrayList<DataRecordStatus> ll = map.get(drs2.getMonitorGroup());
				if (null == ll) {
					ll = new ArrayList<DataRecordStatus>();
					map.put(drs2.getMonitorGroup(), ll);
				}
				ll.add(drs2);
			}
		}
		return map;
	}

	@Get
	@Path("divId")
	public long getDelay(String divId) {
		String[] str = divId.split("\\-");
		DataRecordStatus dataRecordStatus = dataRecordStatusManager
				.findByCodeAndType(str[0], str[1]);
		return dataRecordStatus.getDelay();

	}

	public InterfaceConfigManager getInterfaceConfigManager() {
		return interfaceConfigManager;
	}

	public void setInterfaceConfigManager(
			InterfaceConfigManager interfaceConfigManager) {
		this.interfaceConfigManager = interfaceConfigManager;
	}

	public DataRecordStatusManager getDataRecordStatusManager() {
		return dataRecordStatusManager;
	}

}
