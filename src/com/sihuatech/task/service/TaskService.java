package com.sihuatech.task.service;

import java.util.List;

import com.onewaveinc.common.annotation.bumblebee.Bean;
import com.onewaveinc.common.annotation.bumblebee.Delete;
import com.onewaveinc.common.annotation.bumblebee.Get;
import com.onewaveinc.common.annotation.bumblebee.Path;
import com.onewaveinc.common.annotation.bumblebee.Post;
import com.onewaveinc.common.annotation.bumblebee.Resource;
import com.onewaveinc.core.common.task.SchedulerManager;
import com.onewaveinc.core.common.task.entity.Task;
import com.onewaveinc.core.common.task.manager.TaskDefManager;
import com.onewaveinc.core.common.task.manager.TaskManager;
import com.onewaveinc.mip.log.Logger;
import com.sihuatech.interfaceall.interfaceconfig.manager.InterfaceConfigManager;

@Resource("taskService")
@Bean("taskService")
public class TaskService {
	private static Logger logger = Logger.getInstance(TaskService.class);
	private SchedulerManager schedulerManager;
	private TaskManager taskManager;
	private TaskDefManager taskDefManager;
	private InterfaceConfigManager interfaceConfigManager;

	/**
	 * 新增的时候判断code是否存在
	 * 
	 * @param Code
	 * @return 存在返回false ，不存在返回true
	 */
	@Get
	@Path("taskCode")
	public boolean hasTaskCode(String taskcode) {
		List<Task> list = schedulerManager.getTaskManager().getAll();
		if (null != list && list.size() > 0) {
			for (int i = 0; i < list.size(); i++) {
				if (list.get(i).getTaskcode().contains(taskcode)) {
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * 判断定时任务是否绑定接口
	 * 
	 * @param ids
	 * @return
	 */
	@Get
	@Path("interface/{ids}")
	public boolean hasTaskByInterface(Long[] ids) {
		if (ids.length > 0) {
			for (int i = 0; i < ids.length; i++) {
				boolean b = interfaceConfigManager.getByTaskId(ids[i]);
				if (b) {
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	}
		
	@Post
	public String add(TaskFormBean taskbean) {
		System.out.println("+++++++++++++++++"+1);
		Task task = schedulerManager.createTask(taskbean.getTask_defid());
		System.out.println("+++++++++++++++++"+2);
		String msg = "";// 返回的信息
		try {
			task.setDescription(taskbean.getDescription());
			System.out.println("+++++++++++++++++"+3);
			task.setCronstring(taskbean.getTaskUIC().getSubmittedCronString());
			task.setGroupname("group1");
			schedulerManager.addTask(task, false);
			msg = "新建成功";
			logger.info("新增任务成功");
		} catch (Exception e) {
			logger.error("新增任务出现异常", e);
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
				Task task = schedulerManager.getTaskManager().get(ids[i]);
				try {
					schedulerManager.deleteTask(task);
				} catch (Exception e) {
					logger.error("删除出现异常", e);
					msg = "系统异常";
				}
			}
			msg = "删除成功";
		} else {
			msg = "请选择要删除的任务";
		}
		return msg;
	}

	@Get
	@Path("all")
	public List<Task> getTask() {
		return schedulerManager.getTaskManager().getAll();
	}

	public TaskManager getTaskManager() {
		return taskManager;
	}

	public void setTaskManager(TaskManager taskManager) {
		this.taskManager = taskManager;
	}

	public TaskDefManager getTaskDefManager() {
		return taskDefManager;
	}

	public void setTaskDefManager(TaskDefManager taskDefManager) {
		this.taskDefManager = taskDefManager;
	}

	public SchedulerManager getSchedulerManager() {
		return schedulerManager;
	}

	public void setSchedulerManager(SchedulerManager schedulerManager) {
		this.schedulerManager = schedulerManager;
	}

	public InterfaceConfigManager getInterfaceConfigManager() {
		return interfaceConfigManager;
	}

	public void setInterfaceConfigManager(
			InterfaceConfigManager interfaceConfigManager) {
		this.interfaceConfigManager = interfaceConfigManager;
	}

}
