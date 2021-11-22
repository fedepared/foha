DECLARE @cnt INT = 1;
DECLARE @cntTotal INT = (SELECT COUNT(*) FROM Transformadores);
--DECLARE @idTransfo INT;

WHILE @cnt <= @cntTotal
BEGIN
   DECLARE @idTransfo INT = (SELECT TOP(@cnt) idTransfo From Transformadores);
   SET @cnt = @cnt + 1;
   SET @idTransfo=0;
END;