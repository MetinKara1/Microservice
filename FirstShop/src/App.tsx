import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

import productPicture from './images/nike-erkek.jpg';

const App = () => {
    // @ts-ignore
    const socket = socketIOClient.connect('http://localhost:3000', {transports: ['websocket']});

    const [stock, setStock] = useState(2);

    const onBuyButtonClick = () => {
        const payload = {
            stock: 0
        };
        axios.post('http://localhost:3000/post', payload).then((res) => {
          // setNameField(res.data.name);
          // setDescription(res.data.role);
		    });
    }
    
    useEffect(() => {
		axios.get('http://localhost:3000/get').then((res: any) => {
            if(res.data.stock !== undefined) {
                // mongo dbden gelirse
                setStock(res.data.stock);
            } else {
                // redisten gelirse
                setStock(res.data);
            }
		});
	}, []);

	useEffect(() => {
		socket.on("updateStock", (data: any) => {
			console.log("socketten gelen data: ", data);

			let parseData = JSON.parse(data);
			setStock(parseData.stock);
		});
    }, [socket]);
    
    return (
        <div style={{ marginLeft: 10 }}>
            <h2 style={{ textAlign: 'center' }}>Nike Beyaz Erkek Ayakkabı Modeli 2020 Yılı Üretimi</h2>
            <br />
            <div style={{ display: 'flex', flexDirection: 'row'}}>
                <img 
                    src={productPicture} 
                    alt="" 
                    style={{ width: 300, height: 300, border: '1px solid'}} 
                />
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <label style={{ marginLeft: 10, marginBottom: 10}}><b>Marka: </b>Nike</label>
                    <label style={{ marginLeft: 10, marginBottom: 10}}><b>Model: </b>Airmax</label>
                    <label style={{ marginLeft: 10, marginBottom: 10}}><b>Üretim Yılı: </b>2020</label>
                    <label style={{ marginLeft: 10, marginBottom: 10}}><b>Renk: </b>Siyah</label>
                    <label style={{ marginLeft: 10, marginBottom: 10}}><b>Stok Adedi: </b>{stock}</label>
                    {stock > 0 && 
                    <label 
                        style={{ 
                            marginLeft: 10, 
                            marginBottom: 10, 
                            color: 'red'
                            }}>
                        <b>Acele edin son 1 adet kaldı! </b>
                    </label>}
                    {stock === 0 &&
                        <label 
                            style={{ 
                                marginLeft: 10, 
                                marginBottom: 10, 
                                color: 'red'
                            }}>
                                <b>Ürün Tükendi! </b>
                        </label>
                    }
                    {stock > 0 && 
                    <button 
                        style={{
                            padding: '5px 12px 5px 12px',
                            border: '1px solid #007bff',
                            color: 'white',
                            background: '#007bff',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginLeft: 10
                        }}
                        onClick={onBuyButtonClick}
                    >
                        Satın Al
                    </button>}
                </div>
            </div>
        </div>
    )
}

export default App;
