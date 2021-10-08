# Zeta API

## GET /wishes?from=10&to=20

Returns list of Wishes, starting with newest, ordered by creation time.
List start and end can be set by params.
When no param is passed, a limited number of Wishes are returned.
This number limit can be set by environment variable `REACT_APP_WISHES_LENGTH`, otherwise default is 100.

### Params

| Name | Param | Type | Description |
| ----- | ---- | ---- | ----------- |
| from | Query | Non-negative integer | Return Wishes from this index |
| to | Query | Non-negative integer | Return Wishes to this index |

### 200

    [{   
        id: 1,
        title: 'Title of the Wish',
        description: 'Description of the Wish',
        images: [
            'http://image-source.jpg',
        ],
        offers: [
            '/offer/25',                        
        ],
        ts: 1633680899636,
    }]



## GET /wishes/:id

Returns one Wish by `id`.
When no Wish is found by the passed `id`, returns 404.  

### Params

| Name | Param | Type | Description |
| ----- | ---- | ---- | ----------- |
| id | Route | Non-negative integer | id of Wish |

### 200

    {   
        id: 1,
        title: 'Title of the Wish',
        description: 'Description of the Wish',
        images: [
            'http://image-source.jpg',
        ],
        offers: [
            '/offer/25',                        
        ],
        ts: 1633680899636,
    }

## POST /wishes

Creates a new Wish.

### Request body

    {
        title: 'Title of the Wish',
        description: 'Description of the Wish',
        images: [
            'http://image-source.jpg',
        ],
    }

### 200

Returns the created `id` of the new Wish.

### 400

Request body validation error.
Returned data may contain info about the error.  

## GET /wishes/:id/offers

Returns list of all Offers, contained by Wish with `id`.
When no Wish is found with `id, returns 404.

### Params

| Name | Param | Type | Description |
| ----- | ---- | ---- | ----------- |
| id | Route | Non-negative integer | id of Wish |

### 200

    [  
        {
            id: 1,
            description: 'Offer text...',
            images: [
                'http://image-source.jpg',
            ],
            wish: '/wishes/123',
            ts: 1633680899636,
        },
    ]

## DELETE /wishes/:id

## GET /offers/:id
## POST /offers

### 200

    {
        id: 1,
        description: 'Offer text...',
        images: [
            'http://image-source.jpg',
        ],
        wish: '/wishes/123',
        ts: 1633680899636,
    }

## DELETE /offers/:id
