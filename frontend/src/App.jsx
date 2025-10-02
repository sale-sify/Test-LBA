import { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, TextField, Button, FormControlLabel, Checkbox, Box } from '@mui/material';
import './App.css';


function App() {

  const[products, setProducts] = useState([]);
  const[form, setForm] = useState({
    name: "",
    type: "",
    price: "",
    rating: "",
    warranty_years: "",
    available: true,
  });

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("API error", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "number" && value !== "" ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(form),
      });
      const newProduct = await res.json();
      setProducts([...products, newProduct]);
      setForm({ name: "", type: "", price: "", rating: "", warranty_years: "", available: true });
    } catch (err) {
      console.error("Erreur ajout nouveau produit", err);
    }
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant='h2' gutterBottom>Mes Produits</Typography>


      <Box 
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          p: 3,
          border: "1px solid white",
          borderRadius: 2,
          backgroundColor: "#333",
          marginBottom: 4,
        }}
      >
        <Typography variant='h4' sx={{ margin: 3 }}>Ajouter un produit</Typography>

        
          <TextField 
            label="Nom du Produit"
            name='name'
            value={form.name}
            onChange={handleChange}
            sx={{ 
              margin: 2,
              minWidth: 250,
              maxWidth: 350,
              input: { color: "white"},
              label: { color: "white"},
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" }, // contour blanc
                  "&:hover fieldset": { borderColor: "lightgray" }, // au hover
                  "&.Mui-focused fieldset": { borderColor: "white" } // focus
                },
            }}
          />
          <TextField
            label="Type" 
            name='type'
            value={form.type}
            onChange={handleChange}
            sx={{ 
              margin: 2,
              minWidth: 250,
              maxWidth: 350,
              input: { color: "white"},
              label: { color: "white"},
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" }, // contour blanc
                  "&:hover fieldset": { borderColor: "lightgray" }, // au hover
                  "&.Mui-focused fieldset": { borderColor: "white" } // focus
                },
            }}
          />
          <TextField
            label="Prix"
            name='price'
            type='number'
            value={form.price}
            onChange={handleChange}
            sx={{ 
              margin: 2,
              minWidth: 250,
              maxWidth: 350,
              input: { color: "white"},
              label: { color: "white"},
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" }, // contour blanc
                  "&:hover fieldset": { borderColor: "lightgray" }, // au hover
                  "&.Mui-focused fieldset": { borderColor: "white" } // focus
                },
            }}
          />
          <TextField
            label="Note sur 5"
            name='rating'
            type='number'
            value={form.rating}
            onChange={handleChange}
            sx={{ 
              margin: 2,
              minWidth: 250,
              maxWidth: 350,
              input: { color: "white"},
              label: { color: "white"},
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" }, // contour blanc
                  "&:hover fieldset": { borderColor: "lightgray" }, // au hover
                  "&.Mui-focused fieldset": { borderColor: "white" } // focus
                },
            }}
          />
          <TextField
            label="Garantie pendant :"
            name='warranty_years'
            type='number'
            value={form.warranty_years}
            onChange={handleChange}
            sx={{ 
              margin: 2,
              minWidth: 250,
              maxWidth: 350,
              input: { color: "white"},
              label: { color: "white"},
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" }, // contour blanc
                  "&:hover fieldset": { borderColor: "lightgray" }, // au hover
                  "&.Mui-focused fieldset": { borderColor: "white" } // focus
                },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked})} 
              />
            }
            label="Disponible"
          />

          <Button type='submit' variant='contained' color="primary">Ajouter</Button>
          
       
      </Box>
      
      <Grid container spacing={2}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p._id}>
            <Card sx={{ minHeight: 150, background: '#555555da'}}>
              <CardContent sx={{  color: "white" }}>
                <Typography variant='h6'>{p.name}</Typography>
                <Typography variant='body1'sx={{ textAlign: 'left'}}>Prix : {p.price}$</Typography>
                <Typography variant='body2'sx={{ marginTop: 3, textAlign: 'left'}}>Type : {p.type}</Typography>
                <Typography variant='body2'sx={{ textAlign: 'left'}}>Disponible : {p.available ? "Oui" : "Non"}</Typography>
                <Typography variant='body2'sx={{ textAlign: 'left'}}>Garantie : {p.warranty_years} Ans</Typography>
                <Typography variant='body2'sx={{ textAlign: 'left'}}>Note {p.rating}/5</Typography>
              </CardContent>

            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    
    
  );
}

export default App;
