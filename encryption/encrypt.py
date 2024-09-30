# Encryption and decryption code
from Crypto.Random import get_random_bytes
from Crypto.Protocol.KDF import PBKDF2

from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

token_to_encrypt = "7-BAWahwiPkdvO2MH"

'''This function is a helper 
to generate the salt. Call it and use it
as needed. This process should be done only
once'''
def getting_salt():
    simple_key = get_random_bytes(32)
    print(simple_key)
    return simple_key
    
'''Getting the key should be done once.
After that, could consider storing the key
as environment variable to ease access and making
sure the key is consistent'''
def getting_encryption_key(password, salt):
    encryption_key = PBKDF2(password, salt, dkLen=32)
    print(encryption_key)
    return encryption_key

# Those are used for testing purposes, but in production they should
# not be used
# Also consider saving salt and password somewhere so the same
# can be generated
salt = b'\xdc>H\xfcC\xfb,\x80\xd4\xfeE\xa0\x15S=\xa0\x11\x8d\x7f\xd8\xe3\xf0\xe4\xfe\x96\x17~\x0b\x10\x9e\xaf\xe2'
password = "thisisforpaul"
encryption_key = getting_encryption_key(password, salt)

def encrypt_token(encryption_key, token_to_encrypt):
    cipher = AES.new(encryption_key, AES.MODE_CBC)
    iv = cipher.iv # May remove, this is getting the initialization vector (IV)
    
    # Need to switch token to bytes
    token_to_byte = token_to_encrypt.encode('utf-8')
    
    encrypted_data = cipher.encrypt(pad(token_to_byte, AES.block_size))
    return iv + encrypted_data # Return both IV and encrypted data

def decrypt_token(encryption_key, token_to_decrypt):
    iv = token_to_decrypt[:16] # First 16 bytes will be IV
    encrypted_data = token_to_decrypt[16:] # Encrypted token
    
    cipher = AES.new(encryption_key, AES.MODE_CBC, iv)
    
    decrypted_data = unpad(cipher.decrypt(encrypted_data), AES.block_size)
    
    byte_to_token = decrypted_data.decode('utf-8')
    return byte_to_token

def testing_decrypt(encryption_key, token_to_encrypt):
    encrypted_token = encrypt_token(encryption_key, token_to_encrypt)
    
    print(f"The encrypted token: {encrypted_token}", end="\n\n")
    
    print("Proceeding to decrypting", end="\n\n")
    
    decrypted_token = decrypt_token(encryption_key, encrypted_token)
    print(f"The decrypted token is: {decrypted_token}", end="\n\n")
    
testing_decrypt(encryption_key, token_to_encrypt)