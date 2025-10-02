import { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, TextField, Button, FormControlLabel, Checkbox, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { io } from "socket.io-client";
import './App.css';


function App() {

  const[open, setOpen] = useState(false);
  const[currentProduct, setCurrentProduct] = useState(null);
  const[errors, setErrors] = useState({});
  const[products, setProducts] = useState([]);
  const[form, setForm] = useState({
    name: "",
    type: "",
    price: "",
    rating: "",
    warranty_years: "",
    available: false,
  });

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("API error", err));

      const socket = io("http://localhost:5000");

      socket.on("productAdded", (newProduct) => {
        setProducts(prev => [...prev, newProduct]);
      });

      socket.on("productUpdated", (updatedProduct) => {
        setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));
      });

      socket.on("productDeleted", (deletedId) => {
        setProducts(prev => prev.filter(p => p._id !== deletedId));
      });

      return () => socket.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "number" && value !== "" ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(form),
      });
      const newProduct = await res.json();
      setProducts([...products, newProduct]);
      setForm({ name: "", type: "", price: "", rating: "", warranty_years: "", available: false });
    } catch (err) {
      console.error("Erreur ajout nouveau produit", err);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!form.name || form.name.length < 2) {
      newErrors.name = "Le nom est obligatoire (min. 2 caracteres)"
    }
    if (!form.type) {
      newErrors.type = "Le type est obligatoire"
    }
    if (!form.price || form.price <= 0) {
      newErrors.price = "Le prix doit etre superieur a zero"
    }
    if (form.rating < 0 || form.rating > 5) {
      newErrors.rating = "La note doit etre comprise entre 0 et 5"
    }
    if (form.warranty_years < 0) {
      newErrors.warranty_years = "La garantie ne peut etre inferieure a zero"
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }


  return (
    <Container sx={{ marginTop: 4 }}>

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
            error={!!errors.name}
            helperText={errors.name}
            sx={{ 
              margin: 1,
              minWidth: 250,
              maxWidth: 350,
              input: { color: "white"},
              label: { color: "white"},
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" }, 
                  "&:hover fieldset": { borderColor: "lightgray" }, 
                  "&.Mui-focused fieldset": { borderColor: "white" } 
                },
            }}
          />
          <TextField
            label="Type" 
            name='type'
            value={form.type}
            onChange={handleChange}
            error={!!errors.type}
            helperText={errors.type}
            sx={{ 
              margin: 1,
              minWidth: 250,
              maxWidth: 350,
              input: { color: "white"},
              label: { color: "white"},
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" }, 
                  "&:hover fieldset": { borderColor: "lightgray" }, 
                  "&.Mui-focused fieldset": { borderColor: "white" } 
                },
            }}
          />
          <TextField
            label="Prix"
            name='price'
            type='number'
            value={form.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
            sx={{ 
              margin: 1,
              minWidth: 250,
              maxWidth: 350,
              input: { color: "white"},
              label: { color: "white"},
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" }, 
                  "&:hover fieldset": { borderColor: "lightgray" }, 
                  "&.Mui-focused fieldset": { borderColor: "white" } 
                },
            }}
          />
          <TextField
            label="Note sur 5"
            name='rating'
            type='number'
            value={form.rating}
            onChange={handleChange}
            error={!!errors.rating}
            helperText={errors.rating}
            sx={{ 
              margin: 1,
              minWidth: 250,
              maxWidth: 350,
              input: { color: "white"},
              label: { color: "white"},
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" }, 
                  "&:hover fieldset": { borderColor: "lightgray" }, 
                  "&.Mui-focused fieldset": { borderColor: "white" } 
                },
            }}
          />
          <TextField
            label="Garantie pendant :"
            name='warranty_years'
            type='number'
            value={form.warranty_years}
            onChange={handleChange}
            error={!!errors.warranty_years}
            helperText={errors.warranty_years}
            sx={{ 
              margin: 1,
              minWidth: 250,
              maxWidth: 350,
              input: { color: "white"},
              label: { color: "white"},
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" }, 
                  "&:hover fieldset": { borderColor: "lightgray" }, 
                  "&.Mui-focused fieldset": { borderColor: "white" } 
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

          <Button 
          type='submit' 
          variant='contained' 
          color="primary"
          sx={{ 
            margin: 2,
            minWidth: 250,
            maxWidth: 350,
            height: 70,
            fontSize: 20
           }}
          >
            Ajouter
          </Button>

          
       
      </Box>
      
      <Grid container spacing={2}>
        <Typography variant='h2' gutterBottom sx={{ width: '100%'}}>Mes Produits</Typography>
        {products.map((p) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={p._id}
            
          >
            <Card sx={{ 
              minHeight: 150,
              background: '#555555da',
              width: 215
              }}
            >
              <CardContent sx={{  color: "white" }}>
                <Typography variant='h6'>{p.name}</Typography>
                <Typography variant='body1'sx={{ textAlign: 'left'}}>Prix : {p.price}$</Typography>
                <Typography variant='body2'sx={{ marginTop: 3, textAlign: 'left'}}>Type : {p.type}</Typography>
                <Typography variant='body2'sx={{ textAlign: 'left'}}>Disponible : {p.available ? "Oui" : "Non"}</Typography>
                <Typography variant='body2'sx={{ textAlign: 'left'}}>Garantie : {p.warranty_years} Ans</Typography>
                <Typography variant='body2'sx={{ textAlign: 'left'}}>Note {p.rating}/5</Typography>
                

                <Button
                  variant='contained'
                  color='primary'
                  size='small'
                  sx={{ marginTop: 1 }}
                  onClick={ () => {
                    setCurrentProduct(p);
                    setOpen(true);
                  }}
                >
                  Modifier
                </Button>

                <Button
                  variant='contained'
                  color='error'
                  size='small'
                  sx={{ marginTop: 1 }}
                  onClick={async () => {
                    try {
                      await fetch(`http://localhost:5000/products/${p._id}`, {
                        method: "DELETE"
                      });
                      setProducts(products.filter(prod => prod._id !== p._id));
                    } catch (err) {
                      console.error("Erreur suppression", err);
                    }
                  }}
                  >
                     Supprimer
                </Button>

              </CardContent>

            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#333",    
            color: "white",              
            border: "1px solid white",   
            borderRadius: 2,
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: "1px solid white" }}>Modifier le produit</DialogTitle>
        {currentProduct && (
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Nom"
              name="name"
              value={currentProduct.name}
              onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
              sx={{ 
                marginTop: 2,
                input: { color: "white" },
                label: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "lightgray" },
                  "&.Mui-focused fieldset": { borderColor: "white" }
                }
              }}
            />
            <TextField
              label="Prix"
              type="number"
              name="price"
              value={currentProduct.price}
              onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
              sx={{ 
                marginTop: 2,
                input: { color: "white" },
                label: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "lightgray" },
                  "&.Mui-focused fieldset": { borderColor: "white" }
                }
              }}
            />
            <TextField
              label="Type"
              name="type"
              value={currentProduct.type}
              onChange={(e) => setCurrentProduct({ ...currentProduct, type: e.target.value })}
              sx={{ 
                marginTop: 2,
                input: { color: "white" },
                label: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "lightgray" },
                  "&.Mui-focused fieldset": { borderColor: "white" }
                }
              }}
            />
            <TextField
              label="Note"
              type="number"
              name="rating"
              value={currentProduct.rating}
              onChange={(e) => setCurrentProduct({ ...currentProduct, rating: Number(e.target.value) })}
              sx={{ 
                marginTop: 2,
                input: { color: "white" },
                label: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "lightgray" },
                  "&.Mui-focused fieldset": { borderColor: "white" }
                }
              }}
            />
            <TextField
              label="Garantie"
              type="number"
              name="warranty_years"
              value={currentProduct.warranty_years}
              onChange={(e) => setCurrentProduct({ ...currentProduct, warranty_years: Number(e.target.value) })}
              sx={{ 
                marginTop: 2,
                input: { color: "white" },
                label: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "lightgray" },
                  "&.Mui-focused fieldset": { borderColor: "white" }
                }
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentProduct.available}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, available: e.target.checked })
                  }
                  sx={{ color: "white" }}
                />
              }
              label="Disponible"
              sx={{ color: "white" }}
            />
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button 
            variant="contained" 
            onClick={async () => {
              try {
                const res = await fetch(`http://localhost:5000/products/${currentProduct._id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(currentProduct),
                });
                const updated = await res.json();
                setProducts(products.map(p => p._id === updated._id ? updated : p));
                setOpen(false);
              } catch (err) {
                console.error("Erreur modification", err);
              }
            }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    
    
  );
}

export default App;
