// export const CargaMasiva = () => {
//   return (
//     <>
//     <table>

//     </table>
//     </>
//   )
// }

import { useState } from "react";
import { getMonthInfo } from "../utils/dateUtils";

export const CargaMasiva = () => {
  const [monthNumber, setMonthNumber] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthInfo, setMonthInfo] = useState(getMonthInfo(monthNumber, year));

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    setMonthNumber(newMonth);
    setMonthInfo(getMonthInfo(newMonth, year));
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setYear(newYear);
    setMonthInfo(getMonthInfo(monthNumber, newYear));
  };

  return (
    <div className="container mt-4">
      <h2>Información del Mes</h2>

      <div className="row mb-4">
        <div className="col-md-3">
          <label className="form-label">Mes:</label>
          <select
            className="form-select"
            value={monthNumber}
            onChange={handleMonthChange}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {getMonthInfo(i + 1).monthName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Año:</label>
          <input
            type="number"
            className="form-control"
            value={year}
            onChange={handleYearChange}
            min={2000}
            max={2100}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4>
            {monthInfo.monthName} {monthInfo.year}
          </h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h5>Datos Generales</h5>
              <ul className="list-group">
                <li className="list-group-item">
                  <strong>Total de días:</strong> {monthInfo.totalDays}
                </li>
                <li className="list-group-item">
                  <strong>Primer día:</strong> {monthInfo.firstDay.dayName} (
                  {monthInfo.firstDay.date.toLocaleDateString()})
                </li>
                <li className="list-group-item">
                  <strong>Último día:</strong> {monthInfo.lastDay.dayName} (
                  {monthInfo.lastDay.date.toLocaleDateString()})
                </li>
              </ul>
            </div>

            <div className="col-md-6">
              <h5>Días de Fin de Semana</h5>
              <ul className="list-group">
                <li className="list-group-item">
                  <strong>Sábados:</strong>{" "}
                  {monthInfo.weekends.saturdays.join(", ")}
                </li>
                <li className="list-group-item">
                  <strong>Domingos:</strong>{" "}
                  {monthInfo.weekends.sundays.join(", ")}
                </li>
                <li className="list-group-item">
                  <strong>Total días fin de semana:</strong>{" "}
                  {monthInfo.weekends.allWeekendDays.length}
                </li>
                <li className="list-group-item">
                  <strong>Días laborables:</strong> {monthInfo.workdays.length}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="row">
          <div className="col">
            <h3>REGISTRO DE TURNOS</h3>
            <div className="table-responsive">
                <table className="table">
                <thead>
                    <tr>
                    <th>DIAS</th>
                    {(() => {
                        const td = [];
                        for (let index = 1; index <= monthInfo.totalDays; index++) {
                        td.push(<th>{index}</th>);
                        }
                        return td;
                    })()}
                    </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="p-0">ALIAGA RAFAEL GRETA CECILIA</td>
                    {(() => {
                        const td = [];
                        for (let index = 1; index <= monthInfo.totalDays; index++) {
                        td.push(<td><input type="text" size={1} className="form-control p-0 text-center"/></td>);
                        }
                        return td;
                    })()}
                    </tr>
                </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
