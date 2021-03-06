USE [fohaIni]
GO
/****** Object:  Table [dbo].[tipoEtapa]    Script Date: 09/01/2022 12:36:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tipoEtapa](
	[idTipoEtapa] [int] IDENTITY(1,1) NOT NULL,
	[nombreEtapa] [varchar](150) NOT NULL,
	[orden] [int] NULL,
	[abrev] [varchar](50) NULL,
 CONSTRAINT [PK_tipoEtapas] PRIMARY KEY CLUSTERED 
(
	[idTipoEtapa] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[tipoEtapa] ON 

INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (1, N'documentacion', 1, N'DOC')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (2, N'bobinaBT1', 2, N'BT1')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (3, N'bobinaBT2', 3, N'BT2')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (4, N'bobinaBT3', 4, N'BT3')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (5, N'bobinaAT1', 5, N'AT1')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (6, N'bobinaAT2', 6, N'AT2')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (7, N'bobinaAT3', 7, N'AT3')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (8, N'bobinaRG1', 8, N'RG1')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (9, N'bobinaRG2', 9, N'RG2')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (10, N'bobinaRG3', 10, N'RG3')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (11, N'bobinaRF1', 11, N'RF1')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (12, N'bobinaRF2', 12, N'RF2')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (13, N'bobinaRF3', 13, N'RF3')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (14, N'ensamblajeBobinas', 14, N'ENS')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (15, N'corteYPlegadoPYS', 15, N'PY CYP')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (16, N'soldaduraPYS', 16, N'PY SOL')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (17, N'envioPYS', 17, N'PY ENV')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (18, N'nucleo', 20, N'NUC')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (19, N'montaje', 21, N'MON')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (20, N'horno', 25, N'HOR')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (21, N'cYPTapaCuba', 26, N'CUBA CYP')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (22, N'tapa', 35, N'SOL TAPA')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (23, N'radiadoresOPaneles', 27, N'RAD PAN')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (24, N'cuba', 29, N'SOL CUBA')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (25, N'tintasPenetrantes', 30, N'HERM')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (26, N'granallado', 31, N'GRAN CUBA')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (27, N'pintura', 32, N'PINT CUBA')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (28, N'encubado', 39, N'ENC')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (29, N'ensayosRef', 40, N'LAB')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (30, N'terminacion', 41, N'TERM')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (31, N'envioADeposito', 42, N'APR')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (32, N'envioACliente', 43, N'ENV')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (33, N'CYPPatas', 18, N'CYP PAT')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (34, N'EnvioPatas', 19, N'PAT ENV')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (35, N'ConexBT', 22, N'CON BT')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (36, N'conexAT', 23, N'CON AT')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (37, N'RelacTransf', 24, N'REL TRA')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (38, N'EnvioCuba', 33, N'ENV CUBA')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (39, N'cYPTapa', 34, N'CYP TAPA')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (40, N'GranalladoTapa', 36, N'GRAN TAPA')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (41, N'PinturaTapa', 37, N'PINT TAPA')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (42, N'EnvioTapa', 38, N'ENV TAPA')
INSERT [dbo].[tipoEtapa] ([idTipoEtapa], [nombreEtapa], [orden], [abrev]) VALUES (43, N'Cubierta', 28, N'CUBI')
SET IDENTITY_INSERT [dbo].[tipoEtapa] OFF
GO
