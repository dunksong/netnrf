﻿using System.IO;
using System.Text;

namespace Netnr.Core
{
    public class FileTo
    {
        /// <summary>
        /// 流写入
        /// </summary>
        /// <param name="content">内容</param>
        /// <param name="path">物理目录</param>
        /// <param name="fileName">文件名</param>
        /// <param name="e">编码</param>
        /// <param name="type">写入类型 默认 追加 cover 则覆盖</param>
        public static void WriteText(string content, string path, string fileName, Encoding e, string type = "add")
        {
            FileStream fs;

            //检测目录
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
                fs = new FileStream(path + fileName, FileMode.Create);
            }
            else
            {
                //文件是否存在 创建 OR 追加
                if (!File.Exists(path + fileName))
                {
                    fs = new FileStream(path + fileName, FileMode.Create);
                }
                else
                {
                    FileMode fm = type == "add" ? FileMode.Append : FileMode.Truncate;
                    fs = new FileStream(path + fileName, fm);
                }
            }

            //流写入
            StreamWriter sw = new StreamWriter(fs, e);
            sw.WriteLine(content);
            sw.Close();
            fs.Close();
        }

        public static void WriteText(string content, string path, string fileName, string type = "add")
        {
            WriteText(content, path, fileName, Encoding.UTF8, type);
        }

    }
}