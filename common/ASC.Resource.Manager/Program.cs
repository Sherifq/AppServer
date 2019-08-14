﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

using ASC.Common.DependencyInjection;
using ASC.Common.Utils;
using CommandLine;
using Microsoft.Extensions.DependencyInjection;

namespace ASC.Resource.Manager
{
    class Program
    {
        public static void Main(string[] args)
        {
            Parser.Default.ParseArguments<Options>(args).WithParsed(Export);
        }

        public static void Export(Options options)
        {
            var services = new ServiceCollection();
            var startup = new Startup();
            startup.ConfigureServices(services);
            var serviceProvider = services.BuildServiceProvider();
            CommonServiceProvider.Init(serviceProvider);
            ConfigurationManager.Init(serviceProvider);

            var cultures = new List<string>();
            var projects = new List<ResFile>();
            var enabledSettings = new EnabledSettings();
            Action<string, string, string, string, string, string> export = null;

            try
            {
                var (project, module, filePath, exportPath, culture, format, key) = options;


                if (format == "json")
                {
                    export = JsonManager.Export;
                }
                else
                {
                    export = ResxManager.Export;
                }

                if (string.IsNullOrEmpty(exportPath))
                {
                    exportPath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
                }

                if (!Path.IsPathRooted(exportPath))
                {
                    exportPath = Path.GetFullPath(Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), exportPath));
                }

                if (!Directory.Exists(exportPath))
                {
                    Console.WriteLine("Error!!! Export path doesn't exist! Please enter a valid directory path.");
                    return;
                }

                enabledSettings = ConfigurationManager.GetSetting<EnabledSettings>("enabled");
                cultures = ResourceData.GetCultures().Where(r => r.Available).Select(r => r.Title).Intersect(enabledSettings.Langs).ToList();
                projects = ResourceData.GetAllFiles();

                ExportWithProject(project, module, filePath, culture, exportPath, key);

                Console.WriteLine("The data has been successfully exported!");
            }
            catch (Exception err)
            {
                Console.WriteLine(err);
            }

            void ExportWithProject(string projectName, string moduleName, string fileName, string culture, string exportPath, string key = null)
            {
                if (!string.IsNullOrEmpty(projectName))
                {
                    ExportWithModule(projectName, moduleName, fileName, culture, exportPath, key);
                }
                else
                {
                    foreach (var p in projects.Select(r => r.ProjectName).Intersect(enabledSettings.Projects))
                    {
                        ExportWithModule(p, moduleName, fileName, culture, exportPath, key);
                    }
                }
            }

            void ExportWithModule(string projectName, string moduleName, string fileName, string culture, string exportPath, string key = null)
            {
                if (!string.IsNullOrEmpty(moduleName))
                {
                    ExportWithFile(projectName, moduleName, fileName, culture, exportPath, key);
                }
                else
                {
                    foreach (var m in projects.Where(r => r.ProjectName == projectName).Select(r => r.ModuleName))
                    {
                        ExportWithFile(projectName, m, fileName, culture, exportPath, key);
                    }
                }
            }
            void ExportWithFile(string projectName, string moduleName, string fileName, string culture, string exportPath, string key = null)
            {
                if (!string.IsNullOrEmpty(fileName))
                {
                    ExportWithCulture(projectName, moduleName, fileName, culture, exportPath, key);
                }
                else
                {
                    foreach (var f in projects.Where(r => r.ProjectName == projectName && r.ModuleName == moduleName).Select(r => r.FileName))
                    {
                        ExportWithCulture(projectName, moduleName, f, culture, exportPath, key);
                    }
                }
            }
            void ExportWithCulture(string projectName, string moduleName, string fileName, string culture, string exportPath, string key)
            {
                if (!string.IsNullOrEmpty(culture))
                {
                    export(projectName, moduleName, fileName, culture, exportPath, key);
                }
                else
                {
                    ParallelEnumerable.ForAll(cultures.AsParallel(), c => export(projectName, moduleName, fileName, c, exportPath, key));
                }
            }
        }
    }
}
