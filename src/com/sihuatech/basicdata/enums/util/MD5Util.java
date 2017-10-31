package com.sihuatech.basicdata.enums.util;

public class MD5Util {
	public static String byte2hex(byte[] b) {
		String hs = "";
		String stmp = "";
		for (int n = 0; n < b.length; n++) {
			stmp = (java.lang.Integer.toHexString(b[n] & 0XFF));
			if (stmp.length() == 1)
				hs = hs + "0" + stmp;
			else
				hs = hs + stmp;
			if (n < b.length - 1)
				hs = hs + "";
		}
		return hs.toUpperCase();
	}

	public static byte[] md5(byte[] input) throws Exception {
		java.security.MessageDigest alg = java.security.MessageDigest.getInstance("MD5"); // or "SHA-1"

		alg.update(input);
		byte[] digest = alg.digest();
		return digest;
	}

	public static String md5(String input, String userName) {
		try {
			return byte2hex(md5((userName + "+" + input + "_" + userName).getBytes()));
		} catch (Exception e) {
			return input;
		}
	}
}
