export const getAssets = `query($assets: [String]!) {
  editions(where: { asset: { _in: $assets }}) {
    asset
    artwork {
      title
    }
  }
}`;

export const getTransactionUser = `query($id: uuid!) {
  transactions_by_pk(id: $id) {
    user_id
  }
}`;

export const getUserByAddress = `query($address: String!) {
  users(where: { _or: [{ address: { _eq: $address }}, { multisig: { _eq: $address }}]}) {
    id
    address
    multisig
  }
}`;

export const getCurrentUser = `query {
  currentuser {
    id
    address
    multisig
    display_name
    full_name
  }
}`;

export const cancelBid = `mutation ($id: uuid!) {
  update_transactions_by_pk(
    pk_columns: { id: $id },
    _set: {
      type: "cancelled_bid"
    }
  ) {
   id
  }
}`;

export const cancelBids = `mutation ($edition_id: uuid!, $start: timestamptz!, $end: timestamptz!) {
  update_transactions(where: { edition_id: { _eq: $edition_id }, created_at: { _gte: $start, _lte: $end }},
    _set: {
      type: "cancelled_bid"
    }
  ) {
    affected_rows
  }
}`;

export const createUtxo = `mutation create_utxo($utxo: utxos_insert_input!) {
  insert_utxos_one(object: $utxo) {
    id
  }
}`;

export const createTransaction = `mutation create_transaction($transaction: transactions_insert_input!) {
  insert_transactions_one(object: $transaction) {
    id
  }
}`;

export const createMessage = `mutation create_message($message: messages_insert_input!) {
  insert_messages_one(object: $message) {
    id
  }
}`;

export const deleteUtxo = `mutation delete_utxo($id: uuid!) {
  delete_utxos_by_pk(id: $id) {
    id
  }
}`;

export const updateArtwork = `mutation ($artwork: artworks_set_input!, $id: uuid!) {
  update_artworks_by_pk(pk_columns: { id: $id }, , _set: $artwork) {
    id
  }
}`;

export const updateViews = `mutation ($id: uuid!) {
  update_editions_by_pk(pk_columns: { id: $id }, _inc: { views: 1 }) {
    id
  }
}`;

export const deleteTransaction = `mutation delete_transaction($id: uuid!) {
  delete_transactions_by_pk(id: $id) {
    id
  }
}`;

export const setHeld = `mutation ($id: uuid!, $held: String!) {
  update_editions_by_pk(pk_columns: { id: $id }, _set: { held: $held }) {
    id
    owner {
      address
      multisig
    }
    asset
  }
}`;

export const setOwner = `mutation($id: uuid!, $owner_id: uuid!) {
  update_artworks_by_pk(
    pk_columns: { id: $id },
    _set: {
      owner_id: $owner_id,
    }
  ) {
    id
  }
}`;

export const getTransactionArtwork = `query($id: uuid!) {
  artworks(where: { id: { _eq: $id }}) {
    id
    auction_start
    auction_end
    bid_increment
    owner {
      id
      display_name
    }
    title
    slug
    bid {
      amount
      user {
        id
        display_name
      }
    }
  }
}`;

export const setRelease = `mutation($id: uuid!, $psbt: String!) {
  update_artworks_by_pk(
    pk_columns: { id: $id },
    _set: {
      auction_release_tx: $psbt,
    }
  ) {
    id
  }
}`;

export const setPsbt = `mutation update_transaction($id: uuid!, $psbt: String!) {
  update_transactions_by_pk(
    pk_columns: { id: $id },
    _set: {
      psbt: $psbt,
      bid_id: $bid_id,
    }
  ) {
    id,
    edition_id
  }
}`;

export const acceptBid = `mutation update_artwork(
  $id: uuid!,
  $owner_id: uuid!,
  $amount: Int!,
  $psbt: String!,
  $asset: String!,
  $hash: String!,
  $bid_id: uuid
) {
  update_artworks_by_pk(
    pk_columns: { id: $id },
    _set: {
      owner_id: $owner_id,
    }
  ) {
    id
  }
  insert_transactions_one(object: {
    edition_id: $id,
    asset: $asset,
    type: "accept",
    amount: $amount,
    hash: $hash,
    psbt: $psbt,
    bid_id: $bid_id,
  }) {
    id,
    edition_id
  }
}`;

export const updateUser = `mutation update_user($user: users_set_input!, $id: uuid!) {
  update_users_by_pk(pk_columns: { id: $id }, _set: $user) {
    id
  }
}`;

export const getUser = `query get_user_by_pk($id: uuid!) {
  users_by_pk(id: $id) {
    display_name
    full_name
  }
}`;

export const getAvatars = `query { users { id, avatar_url }}`;

export const getActiveBids = `query {
  activebids(where: { type: { _eq: "bid" }}) {
    id
    edition_id
    psbt
  }
}`;

export const getActiveListings = `query {
  activelistings {
    id
    edition_id
    psbt
  }
}`;

export const cancelListing = `mutation ($id: uuid!, $edition_id: uuid!) {
  update_editions_by_pk(
    pk_columns: { id: $edition_id },
    _set: {
      list_price: null,
      list_psbt: null
    }
  ) {
   id
  }
  update_transactions_by_pk(
    pk_columns: { id: $id },
    _set: {
      type: "cancelled_listing"
    }
  ) {
   id
  }
}`;

export const getUnconfirmed = `query {
  transactions(
    where: {
      confirmed: {_eq: false},
      type: {_in: ["purchase", "creation", "royalty", "accept", "release", "auction", "cancel", "deposit", "withdrawal"] },
    }
  ) {
    id
    hash
    bid {
      id
    }
  }
}`;

export const setTransactionTime = `mutation($id: uuid!, $created_at: timestamptz!) {
  update_transactions_by_pk(
    pk_columns: { id: $id },
    _set: { created_at: $created_at }
  ) {
    id
  }
}`;

export const getLastTransaction = `query($edition_id: uuid!) {
  transactions(
    where: { edition_id: { _eq: $edition_id }, confirmed: { _eq: true }},
    order_by: { created_at: desc },
    limit: 1
  ) {
    created_at
  }
}`;

export const getContract = `query transactions($asset: String!) {
  transactions(where: {
    _and: [{
        edition: {
          asset: { _eq: $asset }
        }
      },
      {
        type: {
          _eq: "creation"
        }
      }
    ]
  }) {
    contract
  }
}`;

export const getLastTransactionsForAddress = `query($address: String!) {
  transactions(
    where: {
      address: {_eq: $address},
      type: {_in: ["deposit", "withdrawal"]}
    },
    order_by: [{ created_at: desc }]
  ) {
    hash
    type
    asset
    address
    user_id
  }
}`;

export const getTransactions = `query($id: uuid!, $limit: Int) {
  transactions(
    where: {
      user_id: {_eq: $id},
      type: {_in: ["deposit", "withdrawal"]}
    },
    order_by: {created_at: desc},
    limit: $limit
  ) {
    id
    hash
    amount
    created_at
    asset
    type
    json
    hex
    user_id
    address
    confirmed
  }
}`;

export const setConfirmed = `mutation setConfirmed($id: uuid!) {
  update_transactions_by_pk(
    pk_columns: { id: $id },
    _set: {
      confirmed: true
    }
  ) {
    id
    user_id
    edition_id
    hash
    psbt
    type
    asset
    contract
    edition {
      owner_id
      asset
    }
    user {
      username
    }
    bid {
      id
      user_id
    }
  }
}`;

export const getEditionWithBidTransactionByHash = `query getEditionWithBidTransactionByHash($id: uuid!, $hash: String!) {
  editions_by_pk(id: $id) {
    id
    title
    slug
    owner {
      full_name
      display_name
    }
    transactions(where:{type:{_eq:"bid"}}) {
      amount
      user{
        display_name
        full_name
      }
    }
  }
  transactions(where: {hash:{_eq: $hash}, type: {_eq: "bid"}}){
    id
    type
    amount
  }
}`;

export const getEdition = `query($id: uuid!) {
  editions_by_pk(id: $id) {
    id
    owner {
      id
      address
      multisig
    }
    artwork {
      title
      slug
    } 
    asset
    list_price
  }
}`;

export const getUtxos = `query($address: String!) {
  utxos(where: { address: { _eq: $address }}, order_by: [{ tx: { created_at: desc }}]) {
    id
    transaction_id
    tx {
      hash
      hex
      created_at
      confirmed
    }
    vout
    asset
    value
  }
}`;

export const getTransferTransactionsByPsbt = `query($psbt: String!) {
  transactions(
    where: {
      psbt: {_eq: $psbt},
      type: {_eq: "transfer"}
    },
    limit: 1
  ) {
    id
    amount
    user_id
  }
}`;

export const createArtwork = `mutation($artwork: artworks_insert_input!, $tags: [tags_insert_input!]!) {
  insert_artworks_one(object: $artwork) {
    id
  }
  insert_tags(objects: $tags) {
    affected_rows
  }
}`;

export const createComment = `mutation($comment: comments_insert_input!) {
  insert_comments_one(object: $comment) {
    id
  }
}`;

export const getUserByEmail = `query($email: String!) {
  users(where: {_or: [{display_name: {_eq: $email}}, {username: {_eq: $email }}]}, limit: 1) {
    display_name
  }
}`;

export const updateUserByEmail = `mutation($user: users_set_input!, $email: String!) {
  update_users(where: {display_name: {_eq: $email}}, _set: $user) {
    affected_rows
  }
}`;

export const deleteUserByEmail = `mutation($email: String!) {
  delete_users(where: { account: { email: { _eq: $email } } })
  {
    affected_rows
  }
}`;

export const releaseToken = `mutation($id: uuid!, $owner_id: uuid!, $amount: Int!, $psbt: String!, $asset: String!, $hash: String!, $bid_id: uuid, $type: String!) {
  update_editions_by_pk(
    pk_columns: { id: $id },
    _set: {
      owner_id: $owner_id,
    }
  ) {
    id
  }
  insert_transactions_one(object: {
    edition_id: $id,
    asset: $asset,
    type: $type,
    amount: $amount,
    hash: $hash,
    psbt: $psbt,
    bid_id: $bid_id,
    user_id: $owner_id,
  }) {
    id,
    edition_id
  }
}`;

export const getFinishedAuctions = `query($now: timestamptz!) {
  auctions(where: { _and: [
      { auction_end: { _lte: $now }},
      { psbt: { _is_null: false }}
    ]}) {
    id
    reserve
    auction_end
    psbt
    release_psbt
    edition {
      asking_asset
      bid {
        id
        amount
        psbt
        user {
          id
          username
        }
      }
    }
  }
}`;

export const updateMessages = `mutation($message: messages_set_input!, $from: uuid!, $to: uuid!) {
  update_messages(where: {from: {_eq: $from}, to: {_eq: $to}}, _set: $message) {
    affected_rows
  }
}`;

export const createOpenEdition = `mutation ($o: open_editions_insert_input!) {
  insert_open_editions_one(object: $o) {
    id
  }
}`;
