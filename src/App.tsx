import React, {useEffect, useState} from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import productPicture from './images/nike-erkek.jpg';

const App = () => {
    const [stock, setStock] = useState(10);

    // @ts-ignore
    const socket = socketIOClient.connect('192.168.1.9:3000', {transports: ['websocket']});

    useEffect(() => {
        socket.on('updateStock', (data: any) => {
            console.log('socketten gelen data: ', data);

            let parsedData = JSON.parse(data);
            setStock(parsedData.stock);
        })
    }, [socket]);

    useEffect(() => {
        axios.get('http://localhost:3000/get').then((res) => {
            // mongo db'den gelen data
            if(res.data.stock !== undefined) {
                let jsonParse = res.data;
                setStock(jsonParse.stock);
            } else {
                // redis'ten gelen data
                setStock(res.data);
            }
        });
    }, []);

    const onBuyButtonClick = () => {
        const payload = {
            stock: 0
        };
        axios.post('http://192.168.1.9:3000/post', payload).then((res) => {
            // setNameField(res.data.name);
            // setDescription(res.data.role);
        });
    }

    return (
        <div style={{ marginLeft: 10}}>
            <h1 style={{ textAlign: 'center'}}>Ürünün Bulunduğu 2. Mağaza</h1><br />
            <div>
            <div>
            <h3>Nike Beyaz Erkek Ayakkabı Modeli 2020 Yılı Üretimi</h3>
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
        </div>
            
        </div>
    )
}

export default App;
