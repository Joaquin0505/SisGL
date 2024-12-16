import dotenv from "dotenv";
import express from 'express';
import bodyParser from "body-parser";
import cors from "cors"
import helmet from "helmet";
import morgan from "morgan";

import dashboardRoutes from './routes/dashboardRoutes'
//import expenseRoutes from './routes/expenseRoutes'
import userRoutes from './routes/userRoutes'
//import productRoutes from './routes/productRoutes'
import vehiculoRoutes from './routes/vehiculoRoutes'

import costomerRoutes from './routes/costumerRoutes'

import comprobanteRoutes from "./routes/comprobanteRoutes";

import reporteRoutes from './routes/reporteRoutes'

import tipovehiculoRoutes from './routes/tipovehiculoRoutes'

import espacioRoutes from   './routes/espacioRoutes'
import empresaRoutes from './routes/empresaRoutes'



dotenv.config();
const app =express();
app.use(express.json()); // nos ayuda a leer archivos json
app.use(helmet());// dar resouesta de api
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}));//damos permisos para dar informacion al frontend
app.use(morgan("common"));// enviar imnformacion desde postgret
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

app.use("/vehiculo", vehiculoRoutes)
app.use("/customer",costomerRoutes)
app.use("/empresa",empresaRoutes)

app.use("/dashboard", dashboardRoutes);
//app.use("/expenses", expenseRoutes);
app.use("/users", userRoutes );
//app.use("/products", productRoutes)


app.use("/reporte", reporteRoutes)

app.use("/tipovehiculo", tipovehiculoRoutes)

app.use("/espacio", espacioRoutes)

app.use("/comprobante", comprobanteRoutes);

const port = Number(process.env.PORT)||3001;
app.listen(port,"0.0.0.0",()=>{
    console.log(`servidor ejecutando en port ${port}`);
})