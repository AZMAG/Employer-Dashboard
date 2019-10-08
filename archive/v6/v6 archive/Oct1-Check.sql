select count(MagId) as Locations, count(distinct EmpName) as Employers, round(sum(Employees),-1) as Jobs from Employer.dbo.EmpViewerData
where County in ('Maricopa','Pinal') and Employees > 4
--dashboard: MSA 40224 Employers

--select distinct EmpName,sum(Employees) as Jobs from Employer.dbo.EmpViewerData
--where County in ('Maricopa','Pinal') and Employees > 4
--group by EmpName order by EmpName

select count(MagId) as Locations, count(distinct EmpName) as Employers, round(sum(Employees),-1) as Jobs from Employer.dbo.EmpViewerData
where County in ('Maricopa') and Employees > 4
--dashboard: Maricopa 38740

select count(MagId) as Locations, count(distinct EmpName) as Employers, round(sum(Employees),-1) as Jobs from Employer.dbo.EmpViewerData
where Jurisdiction='Phoenix' and Employees > 4
--dashboard: Maricopa 38740

--select count(distinct UltimateParentCountry) as 'FDI Countries' from Employer.dbo.EmpViewerData
--where County in ('Maricopa','Pinal') and International=1

--select distinct UltimateParentCountry, sum(Employees) as Jobs from Employer.dbo.EmpViewerData
--where County in ('Maricopa','Pinal') and International=1
--group by UltimateParentCountry order by UltimateParentCountry

--select top 20 EmpName, count(EmpName) as Locations, round(sum(Employees),-1) as Jobs from Employer.dbo.EmpViewerData
--where County in ('Maricopa','Pinal') and Employees > 4
--group by EmpName order by Jobs desc

--select * from Employer.dbo.EmpViewerData
--where empname like 'Marcos Pizza'

--select UltimateParentCountry, EmpName, Jurisdiction, MagId from Employer.dbo.EmpViewerData
--where UltimateParentCountry like 'Netherlands' and County in ('Maricopa','Pinal')

--select count(distinct UltimateParentCountry) from Employer.dbo.EmpViewerData where International=1 and Jurisdiction = 'Phoenix'

--select MagId, UltimateParentCountry,EmpName,Employees,Jurisdiction from Employer.dbo.EmpviewerData
--where County in ('Maricopa','Pinal') and International=1 and UltimateParentCountry like 'Netherlands'
--and Employees <35 and Employees > 25 

--select * from Employer.dbo.EmpViewerData where EmpName='Leaseweb'