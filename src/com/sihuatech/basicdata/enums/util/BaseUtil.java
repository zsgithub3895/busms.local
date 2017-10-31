package com.sihuatech.basicdata.enums.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipFile;

import com.onewaveinc.mip.log.Logger;

public class BaseUtil {
	private static Logger logger = Logger.getInstance(BaseUtil.class);
	private final static String GETER_START = "get";
	private final static String SET_START = "set";
	
	public final static String SYSTEM_CODE = "SYSTEMCODE";
	
	/**
	 * 此方法用于将数组转换为sql语句里面的in查询括号里的字符串
	 * @param strs
	 * @return
	 */
	public static String arrayToString(String[] strs){
		StringBuilder sb = new StringBuilder();
		for(int i=0;i<strs.length-1;i++){
			sb.append("'"+strs[i]+"',");
		}
		sb.append("'"+strs[strs.length-1]+"'");
		return sb.toString();
	}
	
	/**
	 * 制对象的属性  boo==true源对象的属性值为0或者null的时候不复制
	 * @param dest
	 * @param orig
	 * @param boo
	 * @throws Exception
	 */
	public static void copyProperties(Object dest, Object orig, boolean boo) throws Exception{
		Class<?> clazzOrig = orig.getClass();
		Class<?> clazzDest = dest.getClass();
		Field[] fList = clazzOrig.getFields(); // 此方法可以取public参数包括父类
		if (fList == null || fList.length == 0) {
			fList = clazzOrig.getDeclaredFields(); // 此方法可取所有参数，但不能取父类
		}
		Method method = null;
		Object value = null;
		for(Field field : fList){
			String proName = field.getName();
			Class<?> type = field.getType();
			try {
				method = clazzOrig.getMethod(GETER_START + StringUtils.capitalize(proName));
			} catch (Exception e) {
				continue;
			}
			value = method.invoke(orig);
			if(boo){
				if(value==null||"0".equals(value.toString())){
					continue;
				}
			}
			try {
				method = clazzDest.getMethod(SET_START + StringUtils.capitalize(proName),type);
				method.invoke(dest,value);
			} catch (Exception e) {
				continue;
			}
		}
	}
	
	/**
	 * zip 解压工具
	 * @param zipFileName zip包文件名（绝对地址，如e://HsqlDB.zip）
	 * @param outputDirectory 解压路径
	 * @param encoding 字符集
	 * @return 解析处理的所有文件的绝对路径
	 * @throws Exception
	 */
	public static List<String> unZip(String zipFileName, String outputDirectory, String encoding) throws Exception{
		List<String> absolutePaths = new ArrayList<String>();
		ZipFile zipFile = null;
        try {
            zipFile = new ZipFile(zipFileName, encoding);
            Enumeration<?> e = zipFile.getEntries();
            ZipEntry zipEntry = null;
 
            File dest = new File(outputDirectory);
            dest.mkdirs();
 
            InputStream in = null;
            FileOutputStream out = null;
            File f = null;
            while (e.hasMoreElements()) {
                zipEntry = (ZipEntry) e.nextElement();
                String entryName = zipEntry.getName();
 
                try {
                    if (zipEntry.isDirectory()) {
                    	//空目录暂时不解压
//                        String name = zipEntry.getName();
//                        name = name.substring(0, name.length() - 1);
// 
//                        f = new File(outputDirectory + File.separator + name);
//                        f.mkdirs();
                    } else {
                        int index = entryName.lastIndexOf("\\");
                        if (index != -1) {
                            File df = new File(outputDirectory + File.separator + entryName.substring(0, index));
                            df.mkdirs();
                        }
                        index = entryName.lastIndexOf("/");
                        if (index != -1) {
                            File df = new File(outputDirectory + File.separator + entryName.substring(0, index));
                            df.mkdirs();
                        }
 
                        f = new File(outputDirectory + File.separator + zipEntry.getName());
                        in = zipFile.getInputStream(zipEntry);
                        out = new FileOutputStream(f);
 
                        int c;
                        byte[] by = new byte[1024];
 
                        while ((c = in.read(by)) != -1) {
                            out.write(by, 0, c);
                        }
                        out.flush();
                        absolutePaths.add(f.getAbsolutePath());
                        logger.info("文件[" + f.getName() + "]解压到目录[" + f.getAbsolutePath() + "]");
                    }
                } catch (IOException ex) {
                    logger.error("单个文件解压失败:",ex);
                } finally {
                    if (in != null && out != null) {
                        try {
                            in.close();
                            out.close();
                        } catch (IOException ex) {
                        	logger.error("关闭读写流出错",ex);
                        }
                    }
                }
                
            }
 
        } catch (IOException ex) {
            logger.error("zip文件解压失败：",ex);
        } finally {
            if (zipFile != null) {
                try {
                    zipFile.close();
                } catch (IOException ex) {
                	logger.error("关闭解压流失败",ex);
                }
            }
        }
 
        return absolutePaths;
    }
	
	/**
	 * 将long数组转成String
	 * @param objs
	 * @return
	 */
	public static String toString(long[] objs) {
		StringBuilder sb = new StringBuilder();
		for(long obj : objs) {
			sb.append(obj).append(" ");
		}
		return sb.toString();
	}
	
	/**
	 * 将int数组转成String
	 * @param objs
	 * @return
	 */
	public static String toString(int[] objs) {
		StringBuilder sb = new StringBuilder();
		for(int obj : objs) {
			sb.append(obj).append(" ");
		}
		return sb.toString();
	}
}
