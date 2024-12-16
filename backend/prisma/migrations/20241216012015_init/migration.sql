-- CreateEnum
CREATE TYPE "EstadoEspacio" AS ENUM ('DISPONIBLE', 'OCUPADO', 'MANTENIMIENTO');

-- CreateTable
CREATE TABLE "Bloque" (
    "bloqueId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Bloque_pkey" PRIMARY KEY ("bloqueId")
);

-- CreateTable
CREATE TABLE "Espacio" (
    "espacioId" TEXT NOT NULL,
    "bloqueId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "EstadoEspacio" NOT NULL DEFAULT 'DISPONIBLE',

    CONSTRAINT "Espacio_pkey" PRIMARY KEY ("espacioId")
);

-- CreateTable
CREATE TABLE "Tipovehiculo" (
    "tipovehiculoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tarifa" INTEGER NOT NULL,

    CONSTRAINT "Tipovehiculo_pkey" PRIMARY KEY ("tipovehiculoId")
);

-- CreateTable
CREATE TABLE "Customer" (
    "customerId" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "celphone" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customerId")
);

-- CreateTable
CREATE TABLE "Users" (
    "userId" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "celphone" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Vehiculo" (
    "vehiculoId" TEXT NOT NULL,
    "tipovehiculoId" TEXT NOT NULL,
    "nplaca" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("vehiculoId")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "empresaId" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imagen" TEXT,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("empresaId")
);

-- CreateTable
CREATE TABLE "Comprobante" (
    "comprobanteId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "espacioId" TEXT NOT NULL,
    "fechaentrada" TIMESTAMP(3) NOT NULL,
    "fechasalida" TIMESTAMP(3),
    "descripcion" TEXT,
    "estadoComp" TEXT NOT NULL,

    CONSTRAINT "Comprobante_pkey" PRIMARY KEY ("comprobanteId")
);

-- CreateTable
CREATE TABLE "DetalleComprobante" (
    "dcId" TEXT NOT NULL,
    "comprobanteId" TEXT NOT NULL,
    "importetotal" INTEGER NOT NULL,

    CONSTRAINT "DetalleComprobante_pkey" PRIMARY KEY ("dcId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tipovehiculo_nombre_key" ON "Tipovehiculo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_dni_key" ON "Customer"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Users_dni_key" ON "Users"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_nplaca_key" ON "Vehiculo"("nplaca");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_ruc_key" ON "Empresa"("ruc");

-- AddForeignKey
ALTER TABLE "Espacio" ADD CONSTRAINT "Espacio_bloqueId_fkey" FOREIGN KEY ("bloqueId") REFERENCES "Bloque"("bloqueId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_tipovehiculoId_fkey" FOREIGN KEY ("tipovehiculoId") REFERENCES "Tipovehiculo"("tipovehiculoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("vehiculoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("customerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_espacioId_fkey" FOREIGN KEY ("espacioId") REFERENCES "Espacio"("espacioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleComprobante" ADD CONSTRAINT "DetalleComprobante_comprobanteId_fkey" FOREIGN KEY ("comprobanteId") REFERENCES "Comprobante"("comprobanteId") ON DELETE RESTRICT ON UPDATE CASCADE;
