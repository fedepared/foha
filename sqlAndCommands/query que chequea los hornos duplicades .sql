select count(a.idTipoEtapa) as cuenta,b.idTransfo from etapa as a
inner join Transformadores as b on a.idTransfo=b.idTransfo group by b.idTransfo order by cuenta desc