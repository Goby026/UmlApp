import React, { useEffect, useState } from "react";
import {
  createCargo,
  deleteCargo,
  getCargos,
  updateCargo,
} from "../services/cargos.services";
import Swal from "sweetalert2";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import * as XLSX from 'xlsx'

export const Cargos = () => {
  const [cargos, setCargos] = useState([]);
  const [cargo, setCargo] = useState({
    id: null,
    descripcion: "",
    estado: 1,
  });
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCargos();
  }, []);

  const loadCargos = async () => {
    try {
      const data = await getCargos();
      setCargos(data);
    } catch (error) {
      console.error("Error cargando datos:", error);
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCargo({
      ...cargo,
      [name]: name === "estado" ? parseInt(value) : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!cargo.descripcion.trim())
      newErrors.descripcion = "Descripción es requerida";
    if (cargo.estado === undefined) newErrors.estado = "Estado es requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editing) {
        await updateCargo(currentId, cargo);
        Swal.fire("Actualizado!", "El cargo ha sido actualizado.", "success");
      } else {
        await createCargo(cargo);
        Swal.fire("Creado!", "El cargo ha sido registrado.", "success");
      }

      resetForm();
      loadCargos();
    } catch (error) {
      Swal.fire("Error!", "Ha ocurrido un error al guardar.", "error");
      console.error("Error: ", error);
    }
  };

  const handleEdit = (cargo) => {
    console.log("cargo: ", cargo);
    setCargo({
      id: cargo.id,
      descripcion: cargo.descripcion,
      estado: cargo.estado,
    });

    setCurrentId(cargo.id);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
    });

    if (result.isConfirmed) {
      try {
        await deleteCargo(id);
        Swal.fire("Eliminado!", "El cargo ha sido eliminado.", "success");
        loadCargos();
      } catch (error) {
        Swal.fire("Error!", "Ha ocurrido un error al eliminar.", "error");
        console.error("Error:", error);
      }
    }
  };

  const resetForm = () => {
    setCargo({
      id: null,
      descripcion: "",
      estado: 1,
    });

    setEditing(false);
    setCurrentId(null);
    setErrors({});
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const exportToPDF = () => {
    const doc = new jsPDF()
    
    // Título del documento
    doc.text('Listado de Cargos', 14, 15)
    
    // Datos para la tabla
    const tableData = cargos.map(cargo => [
      cargo.descripcion,
      cargo.estado === 1 ? 'Activo' : 'Inactivo',
      formatDate(cargo.createdAt)
    ])
    
    // Usar autoTable como función independiente
    autoTable(doc, {
      head: [['Descripción', 'Estado', 'Fecha Creación']],
      body: tableData,
      startY: 20,
      styles: {
        cellPadding: 2,
        fontSize: 10,
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30 },
        2: { cellWidth: 40 }
      }
    })
    
    // Guardar el PDF
    doc.save('cargos.pdf')
  }

  const exportToExcel = () => {
    // Preparar los datos
    const data = cargos.map(cargo => ({
      'Descripción': cargo.descripcion,
      'Estado': cargo.estado === 1 ? 'Activo' : 'Inactivo',
      'Fecha Creación': formatDate(cargo.createdAt),
      'Última Actualización': formatDate(cargo.updatedAt)
    }))
    
    // Crear hoja de trabajo
    const ws = XLSX.utils.json_to_sheet(data)
    
    // Crear libro de trabajo
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Cargos')
    
    // Exportar a archivo
    XLSX.writeFile(wb, 'cargos.xlsx')
  }

  return (
    <>
      <Container className="mt-4">
        <h2 className="mb-4">Gestión de cargos</h2>

        <Row>
          {/* columna del formulario */}
          <Col md={6}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Descripción del cargo</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descripcion"
                  value={cargo.descripcion}
                  onChange={handleChange}
                  isInvalid={!!errors.descripcion}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.descripcion}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  name="estado"
                  value={cargo.estado}
                  onChange={handleChange}
                  isInvalid={!!errors.estado}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.estado}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-grid gap-2">
                {editing ? (
                  <>
                    <Button variant="primary" type="submit">
                      Actualiza Cargo
                    </Button>
                    <Button variant="secondary" onClick={resetForm}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="success" type="submit">
                      Registrar Cargo
                    </Button>
                    <Button variant="outline-secondary" type="submit">
                      Nuevo Cargo
                    </Button>
                  </>
                )}
              </div>
            </Form>
          </Col>

          {/* columna de la tabla */}
          <Col md={6}>
            <div className="d-flex justify-content-end mb-3 gap-2">
              <Button
                variant="outline-danger"
                onClick={exportToPDF}
                className="d-flex align-items-center"
              >
                <i className="bi bi-file-pdf me-2"></i> Exportar PDF
              </Button>
              <Button
                variant="outline-success"
                onClick={exportToExcel}
                className="d-flex align-items-center"
              >
                <i className="bi bi-file-excel me-2"></i> Exportar Excel
              </Button>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Fecha Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargos.map((cargo) => (
                  <tr key={cargo.id}>
                    <td>{cargo.descripcion}</td>
                    <td>
                      <Badge bg={cargo.estado === 1 ? "success" : "danger"}>
                        {cargo.estado === 1 ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td>{formatDate(cargo.createdAt)}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleEdit(cargo)}
                        className="me-2"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(cargo.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
};
